import BookingModel from '../../models/booking.model';
import {Room} from '../../models/room.model';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';
import { EventSender } from '../../utils/eventSystem'; 
const eventSender = new EventSender();

const makeBooking = async (data: any) => {
    try {
        let bookingData: any = { // Initialize booking data object
            userId: data.userId,
            roomId: data.roomId,
            guestCount: data.guestCount,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            totalAmount: data.totalAmount,
            paymentStatus: 'pending', // Default payment status to 'pending'
            paymentDate: data.checkIn // Default payment date to check-in date
        };

        if (data.paymentMethod === "onEntry") { // If payment method is on site
            // Create booking with pending payment status and check-in date as payment date
            const booking = await BookingModel.create(bookingData);
            return booking;
        } else { // If payment method is not on site
            try {
                // Send event to handle payment
                await eventSender.sendEvent({
                    name: 'payFee',
                    service: 'payment', // Assuming 'user' is the service name
                    payload: {token: data.token, amount: data.amount, narration: data.narration, id: data.hotelId, payment_type: "hotel"},
                });

                // If payment event is successful, create booking with paid payment status
                bookingData.paymentStatus = 'paid';
                bookingData.paymentDate = new Date();
                const booking = await BookingModel.create(bookingData);
                return booking;
            } catch (error) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to process payment');
            }
        }
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to make booking');
    }
};


const getBookingById = async (bookingId: string) => {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    return booking;
};

// const getHotelBookings = async (hotelId: string) => {
//     const bookings = await BookingModel.find({ roomId: { $in: hotelId } });
//     return bookings;
// };

const updateBooking = async (bookingId: string, bookingData: any) => {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    // Update booking details
    Object.assign(booking, bookingData);
    await booking.save();
    return booking;
};

const cancelBooking = async (bookingId: string) => {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    await booking.remove();
};

export default {
    makeBooking,
    getBookingById,
   // getHotelBookings,
    updateBooking,
    cancelBooking
};

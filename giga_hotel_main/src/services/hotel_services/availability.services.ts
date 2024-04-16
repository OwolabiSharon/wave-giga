import HotelModel from '../../models/hotel.model';
import {Room} from '../../models/room.model';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';

const bookRooms = async (hotelId: string, roomId: string, quantity: number) => {
    try {
        // Check if the room exists
        const room = await Room.findOne({ _id: roomId, hotelId });
        if (!room) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
        }

        // Check if there are enough rooms available to book
        if (room.numberAvailable < quantity) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient rooms available');
        }

        // Update room availability based on the quantity booked (reduce availability)
        await Room.findByIdAndUpdate(roomId, { $inc: { numberAvailable: -quantity } });

        return room;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to book rooms');
    }
};

const checkoutRooms = async (hotelId: string, roomId: string, quantity: number) => {
    try {
        // Check if the room exists
        const room = await Room.findOne({ _id: roomId, hotelId });
        if (!room) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
        }

        // Update room availability based on the quantity checked out (increase availability)
        await Room.findByIdAndUpdate(roomId, { $inc: { numberAvailable: quantity } });

        return room;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to checkout rooms');
    }
};

export default {
    bookRooms,
    checkoutRooms
};

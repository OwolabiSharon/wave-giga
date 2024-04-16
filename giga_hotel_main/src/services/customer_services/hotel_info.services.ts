import HotelModel from '../../models/hotel.model';
import {Room} from '../../models/room.model';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';

const searchHotels = async (state: string, town: string) => {
    const locationCriteria = { state, town };
    const hotels = await HotelModel.find({ location: locationCriteria });

    return hotels;
};

const searchRoomsByCriteria = async (price: number, numberAvailable: number) => {
    const rooms = await Room.find({ 
        price: { $lte: price },
        numberAvailable: { $gte: numberAvailable }
    });

    return rooms;
};

const getHotelAvailability = async (hotelId: string, startDate: Date, endDate: Date) => {
    try {
        const availability = await Room.find({ hotelId, numberAvailable: { $gt: 0 } });
        return availability;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to retrieve availability');
    }
};

const getAllRoomTypesOfHotel = async (hotelId: string) => {
    try {
        // Check if the hotel exists
        const hotel = await HotelModel.findById(hotelId);
        if (!hotel) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Hotel not found');
        }

        // Retrieve all room types offered by the hotel
        const rooms = await Room.find({ hotelId });

        return rooms;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to retrieve room types of hotel');
    }
};

const getRoomTypeDetails = async (roomId: string) => {
    try {
        const room = await Room.findOne({ _id: roomId });
        if (!room) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Room type not found');
        }

        return room;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to retrieve room type details');
    }
};
export default {
    searchHotels,
    searchRoomsByCriteria,
    getHotelAvailability,
    getAllRoomTypesOfHotel,
    getRoomTypeDetails
};

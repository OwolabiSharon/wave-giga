import HotelModel from '../../models/hotel.model';
import {Room} from '../../models/room.model';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';

const createHotelProfile = async (hotelData: any) => {
    try {
        // Create the new hotel profile
        const newHotel = await HotelModel.create(hotelData);
        return newHotel;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create hotel profile');
    }
};

const updateHotelProfile = async (hotelId: string, hotelData: any) => {
    try {
        // Update the hotel profile
        const updatedHotel = await HotelModel.findByIdAndUpdate(hotelId, hotelData, { new: true });
        if (!updatedHotel) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Hotel not found');
        }
        return updatedHotel;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update hotel profile');
    }
};

const deleteHotelProfile = async (hotelId: string) => {
    try {
        // Delete the hotel profile
        const deletedHotel = await HotelModel.findByIdAndDelete(hotelId);
        if (!deletedHotel) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Hotel not found');
        }
        return { message: 'Hotel profile deleted successfully' };
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete hotel profile');
    }
};

export default {
    createHotelProfile,
    updateHotelProfile,
    deleteHotelProfile
};
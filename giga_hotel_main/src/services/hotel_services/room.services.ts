import HotelModel from '../../models/hotel.model';
import {Room} from '../../models/room.model';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';

const addRoomTypeToHotel = async (hotelId: string, roomData: any) => {
    try {
        // Check if the hotel exists
        const hotel = await HotelModel.findById(hotelId);
        if (!hotel) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Hotel not found');
        }

        // Create the new room type and associate it with the hotel
        const newRoom = new Room({ ...roomData, hotelId });
        await newRoom.save();

        // Add the room to the hotel's list of rooms
        hotel.rooms.push(newRoom._id);
        await hotel.save();

        return newRoom;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to add room type to hotel');
    }
};


const updateRoomTypeDetails = async (hotelId: string, roomId: string, roomData: any) => {
    try {
        // Check if the hotel exists
        const hotel = await HotelModel.findById(hotelId);
        if (!hotel) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Hotel not found');
        }

        // Update the room type details
        const room = await Room.findOneAndUpdate({ _id: roomId, hotelId }, roomData, { new: true });
        if (!room) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Room type not found');
        }

        return room;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update room type details');
    }
};

// Remove a room type from a hotel
const removeRoomTypeFromHotel = async (hotelId: string, roomId: string) => {
    try {
        // Check if the hotel exists
        const hotel = await HotelModel.findById(hotelId);
        if (!hotel) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Hotel not found');
        }

        // Remove the room type from the hotel's list of rooms
        await Room.findOneAndDelete({ _id: roomId, hotelId });

        // Remove the room from the hotel's list of rooms
        hotel.rooms = hotel.rooms.filter((roomIdInHotel) => roomIdInHotel.toString() !== roomId);
        await hotel.save();

        return { message: 'Room type removed successfully' };
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to remove room type from hotel');
    }
};

export default {
    addRoomTypeToHotel,
    updateRoomTypeDetails,
    removeRoomTypeFromHotel
};
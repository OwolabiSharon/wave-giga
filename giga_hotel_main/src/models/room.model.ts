import mongoose, { Document, Schema } from 'mongoose';
import Facility from './facility.model';

interface IRoom extends Document {
    type: 'suit' | 'regular_room' | 'premium_room' | 'premium_suit';
    hotelId: Schema.Types.ObjectId;
    images: string[];
    numberAvailable: number;
    totalNumber: number;
    price: number;
    facility: Schema.Types.ObjectId[];
    roomCapacity: number;
}

const RoomSchema: Schema = new Schema({
    type: { type: String, required: true, enum: ['suit', 'regular_room', 'premium_room', 'premium_suit'] },
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    images: { type: [String], required: true },
    numberAvailable: { type: Number, required: true },
    totalNumber: { type: Number, required: true },
    price: { type: Number, required: true },
    facility: [{ type: Schema.Types.ObjectId, ref: 'Facility' },  { default: [] }],
    roomCapacity: { type: Number, required: true }
},{
    timestamps: true
});

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export { Room, IRoom };

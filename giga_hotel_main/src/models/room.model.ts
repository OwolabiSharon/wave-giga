import mongoose, { Document, Schema } from 'mongoose';
import Facility from './facility.model';

interface IRoom extends Document {
    roomNumber: number;
    type: 'regular' | 'premium' | 'luxury';
    isAvailable: boolean;
    price: number;
    facility: Schema.Types.ObjectId[];
    roomCapacity: number;
}

const RoomSchema: Schema = new Schema({
    roomNumber: { type: Number, required: true, unique: true },
    type: { type: String, required: true, enum: ['regular', 'premium', 'luxury'] },
    isAvailable: { type: Boolean, default: true },
    price: { type: Number, required: true },
    facility: [{ type: Schema.Types.ObjectId, ref: 'Facility' },  { default: [] }],
    roomCapacity: { type: Number, required: true }
});

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export { Room, IRoom };
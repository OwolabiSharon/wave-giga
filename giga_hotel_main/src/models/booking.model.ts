import mongoose, { Document, Schema } from 'mongoose';

interface IBooking extends Document {
    userId: Schema.Types.ObjectId;
    roomId: Schema.Types.ObjectId;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalAmount: number;
}

interface IBookingModel extends mongoose.Model<IBooking> {
}

const BookingSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
    totalAmount: { type: Number, required: true }
});

const Booking: IBookingModel = mongoose.model<IBooking, IBookingModel>('Booking', BookingSchema);

export default Booking;

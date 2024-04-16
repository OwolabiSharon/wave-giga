import mongoose, { Document, Schema } from 'mongoose';

interface IBooking extends Document {
    userId: Schema.Types.ObjectId;
    roomId: Schema.Types.ObjectId;
    guestCount: number;
    checkIn: Date;
    checkOut: Date;
    //region: string;
    totalAmount: number;
    paymentId?: string;
    paymentStatus?: string;
    paymentDate?: Date;
    paymentAmount?: number;
    paymentMethod?: string;
}

interface IBookingModel extends mongoose.Model<IBooking> {
}

const BookingSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    guestCount: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    //region: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentId: { type: String },
    paymentStatus: { type: String },
    paymentDate: { type: Date },
    paymentAmount: { type: Number },
    paymentMethod: { type: String }
},
{
    timestamps: true
});

const Booking: IBookingModel = mongoose.model<IBooking, IBookingModel>('Booking', BookingSchema);

export default Booking;

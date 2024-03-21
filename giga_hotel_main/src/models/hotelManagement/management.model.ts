import mongoose, { Document, Schema } from 'mongoose';

interface IManagement extends Document {
    userId: Schema.Types.ObjectId;
    hotelId: Schema.Types.ObjectId;
    earnings: number;
    bookings: Schema.Types.ObjectId[];
    reviews: Schema.Types.ObjectId[];
}

interface IManagementModel extends mongoose.Model<IManagement> {
}

const ManagementSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
});

const Management: IManagementModel = mongoose.model<IManagement, IManagementModel>('Management', ManagementSchema);

export default Management;
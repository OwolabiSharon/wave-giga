import mongoose, { Document, Schema } from 'mongoose';

interface IHotel extends Document {
    name: string;
    rooms: Schema.Types.ObjectId;
    location: string;
    numberOfRooms: number;
    amenities: string[];
    reviews: Schema.Types.ObjectId[];
    starRating: number;
}

interface IHotelModel extends mongoose.Model<IHotel> {
    
}

const HotelSchema: Schema = new Schema({
    name: { type: String, required: true },
    rooms:{ type: Schema.Types.ObjectId, ref: 'Room', required: true},
    location: { type: String, required: true },
    numberOfRooms: { type: Number, required: true },
    amenities: { type: [String], required: true },
    reviews: { type: [Schema.Types.ObjectId], ref: 'Review' },
    starRating: { type: Number, required: true , default: 0}
});


const Hotel : IHotelModel = mongoose.model<IHotel, IHotelModel>('Hotel', HotelSchema);

export default Hotel;
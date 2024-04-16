import mongoose, { Document, Schema } from 'mongoose';

interface Location {
    state: string;
    town: string;
}

interface IHotel extends Document {
    name: string;
    tagLine: string;// where they keep their bio
    rooms: Schema.Types.ObjectId[];
    location: Location;
    numberOfRooms: number;
    amenities: string[];
    petFriendliness: boolean;
    childrenAllowance: boolean;
    reviews: Schema.Types.ObjectId[];
    starRating: number;
    socialMedia: string[];
    website: string;
    earnings: number;
}

interface IHotelModel extends mongoose.Model<IHotel> {
    
}

const HotelSchema: Schema = new Schema({
    name: { type: String, required: true },
    tagLine: { type: String, required: true },
    rooms:{ type: [Schema.Types.ObjectId], ref: 'Room', required: true, default: []},
    location: {
        state: { type: String, required: true },
        town: { type: String, required: true },
        // You can add more properties as needed, like street, postal code, etc.
    },
    numberOfRooms: { type: Number, required: true },
    amenities: { type: [String], required: true },
    petFriendliness: { type: Boolean, required: true },
    childrenAllowance: { type: Boolean, required: true },
    reviews: { type: [Schema.Types.ObjectId], ref: 'Review' },
    starRating: { type: Number, required: true , default: 0},
    socialMedia: { type: [String], required: true },
    website: { type: String, required: true },
    earnings: { type: Number, default: 0 },
},{
    timestamps: true
});


const Hotel : IHotelModel = mongoose.model<IHotel, IHotelModel>('Hotel', HotelSchema);

export default Hotel;
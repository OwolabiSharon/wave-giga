import mongoose, { Document, Schema } from "mongoose";

interface IAmenities extends Document {
    name: string;
    description: string;
}

interface IAmenitiesModel extends mongoose.Model<IAmenities> {
}

const AmenitiesSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
},{
    timestamps: true
});

const Amenities: IAmenitiesModel = mongoose.model<IAmenities, IAmenitiesModel>('Amenities', AmenitiesSchema);
export default Amenities;
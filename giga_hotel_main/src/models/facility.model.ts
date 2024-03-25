import mongoose , { Document, Schema } from 'mongoose';

interface IFacility extends Document {
    name: string;
    description: string;
}

interface IFacilityModel extends mongoose.Model<IFacility> {
}

const FacilitySchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
},{
    timestamps: true
});

const Facility: IFacilityModel = mongoose.model<IFacility, IFacilityModel>('Facility', FacilitySchema);

export default Facility;
import mongoose, { Document, Model, Schema } from 'mongoose';
// import validator from 'validator';
// import bcrypt from 'bcryptjs';


interface IAdminInfo extends Document {
  fuelPrice: string;
  baseFareRegular: string;
  baseFarePremium: string;
}

// interface IAdminInfoModel extends Model<IAdminInfo> {
// }

const adminInfoSchema = new mongoose.Schema<IAdminInfo>(
  {
    fuelPrice: {
      type: String,
      required: true,
      default: "0.0"
    },
    baseFareRegular: {
      type: String,
      required: true,
      default: "0.0"
    },
    baseFarePremium: {
      type: String,
      required: true,
      default: "0.0"
    },
  },
  
  {
    timestamps: true,
  }
);



const AdminInfo = mongoose.model<IAdminInfo>('AdminInfo', adminInfoSchema);
export default AdminInfo;
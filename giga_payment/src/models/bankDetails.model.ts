import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';



interface IBankDetails extends Document {
    bsnkDetails: IBankDetails['_id'];
    name: string;
    bankName: string;
    accountNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IBankDetailsModel extends Model<IBankDetails> {
    
}

const bankDetailsSchema = new mongoose.Schema<IBankDetails>(
    {
    name: {
        type: String,
        trim: true,
        lowercase: true,
        },
    bankName: {
        type: String,
        trim: true,
        lowercase: true,
    },
    accountNumber: {
        type: String,
        unique: true,
        required: true,
        },
    },
    {
        timestamps: true,
    }
);

const BankDetails = mongoose.model<IBankDetails, IBankDetailsModel>('BankDetails', bankDetailsSchema);

export { BankDetails, IBankDetails, IBankDetailsModel };
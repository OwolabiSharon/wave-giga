import mongoose, { Document, Model, Schema } from 'mongoose';

interface IAccountNumber extends Document {
    userId: Schema.Types.ObjectId;
    accountName: string;
    accountNumber: string;
    accountBalance: Number;
    currencyType: String
    bankName: String;
    createdAt: Date;
    updatedAt: Date;
}

interface IAccountNumberModel extends Model<IAccountNumber>{

}

const accountNumberSchema = new mongoose.Schema<IAccountNumber>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    accountBalance: {
        type: Number,
        required: false
    },
    currencyType: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const AccountNumber = mongoose.model<IAccountNumber, IAccountNumberModel>('AccountNumber', accountNumberSchema);

export { AccountNumber, IAccountNumber, IAccountNumberModel };

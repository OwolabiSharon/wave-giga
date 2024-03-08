import mongoose, { Document, Schema } from 'mongoose';

interface ITransaction extends Document {
    transactionId: string;
    amount: number;
    transactionType: string;
    transactionDate: Date;
    metadata: object;
    flowDirection: string;
}
//define metadata schema
export interface MetaData {
    userID: Schema.Types.ObjectId;
    accountNumber: Schema.Types.ObjectId;
    datetime: Date;
}

const TransactionSchema: Schema = new Schema({
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, required: true },
    transactionDate: { type: Date, default: Date.now },
    metadata: { type: Object, required: true },
    flowDirection: { type: String, required: true, enum: ['in', 'out'] },
});

//assign the metadata schema to the transaction schema
TransactionSchema.add({ metadata: {
    type: {
        userID: { type:Schema.Types.ObjectId, ref:'user' , required: true },
        accountdetails: { type: Schema.Types.ObjectId, ref:'accountNumber', required: true },
        datetime: { type: Date, required: true }
    }
}});

const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;

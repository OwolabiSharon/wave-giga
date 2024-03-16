import mongoose, { Document, Schema } from 'mongoose';

interface IPayment extends Document {
    amount: number;
    transactionType: string;
    transactionDate: Date;
    // metadata: object;
    // flowDirection: string;
}


const PaymentSchema: Schema = new Schema({
    amount: { type: Number, required: true },
    transactionType: { type: String, required: true },
    transactionDate: { type: Date, default: Date.now },
    // flowDirection: { type: String, required: true, enum: ['in', 'out'] },
});


const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
import { Document, Model, model, Schema } from 'mongoose';

interface IOrder extends Document {
    cart: Schema.Types.ObjectId;
    payment: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
}

const OrderSchema: Schema = new Schema({
    cart: { type: Schema.Types.ObjectId, required: true, ref: 'Cart' },
    payment: { type: Schema.Types.ObjectId, required: true, ref: 'Payment' }, 
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, 
});

//function to sort the orders by product vendor


const OrderModel: Model<IOrder> = model<IOrder>('Order', OrderSchema);

export { OrderModel };

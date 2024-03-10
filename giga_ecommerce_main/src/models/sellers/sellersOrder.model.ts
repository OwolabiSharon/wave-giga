import { Document, Model, model, Schema, Types } from 'mongoose';

// Schema for SellerOrder
export interface ISellerOrder extends Document {
    orderId: Schema.Types.ObjectId;
    vendorId: Schema.Types.ObjectId;
    items: {
        productId: Schema.Types.ObjectId;
        quantity: number;
        price: number;
    }[];
}

const SellerOrderSchema: Schema = new Schema({
    orderId: { type: Schema.Types.ObjectId, required: true, ref: 'Order' },
    vendorId: { type: Schema.Types.ObjectId, required: true, ref: 'vendor' }, 
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
});

const SellerOrderModel: Model<ISellerOrder> = model<ISellerOrder>('SellerOrder', SellerOrderSchema);

export { SellerOrderModel };

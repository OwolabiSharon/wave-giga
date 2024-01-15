import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface ICartItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
}

interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    items: ICartItem[];
}

const CartSchema: Schema = new Schema({
    // define your schema fields here
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [{
        productId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            required: true,
        }
    }]
}, {
    timestamps: true

});

const Cart: Model<ICart> = mongoose.model<ICart>('Cart', CartSchema);

export default Cart;



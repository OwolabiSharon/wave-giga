import Cart from '../models/users/cart.model';
import { EventSender } from '../utils/eventSystem';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { Types, Schema } from 'mongoose';

interface CartItemPayload {
    productId: Schema.Types.ObjectId;
    quantity: number;
    price: number;
}

interface CreateCartPayload {
    userId: string;
}

interface AddCartItemPayload {
    userId: string;
    productId: Schema.Types.ObjectId;
    quantity: number;
    price: number;
}
interface RemoveCartItemPayload {
    userId: string;
    productId: Schema.Types.ObjectId;
    quantity: number;
}

interface CheckoutPayload {
    userId: string;
}




export class CartService {
    private eventSender: EventSender;

    constructor(eventSender: EventSender) {
        this.eventSender = eventSender;
    }

    public async createCart(payload: CreateCartPayload): Promise<any> {
        const { userId } = payload;
        const cart = await Cart.create({ userId, items: [] });
        return cart.toObject();
    }

    public async updateCart(userId: string, cartItems: CartItemPayload[]): Promise<any> {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
        }

        // Update cart items based on the payload
        for (const cartItem of cartItems) {
        const { productId, quantity, price } = cartItem;

        const existingItem = cart.items.find(item => item.productId.toString() === productId.toString());

        if (existingItem) {
            // If the product already exists, update the quantity
            existingItem.quantity += quantity;
        } else {
            // If the product doesn't exist, add a new item
            cart.items.push({ productId, quantity, price });
        }
        }

        // Save the updated cart
        await cart.save();

        return cart.toObject();
    }

    public async clearCart(userId: string): Promise<any> {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
        }

        //remove all items from cart
        cart.items = [];

        // Save the updated cart
        await cart.save();
        //on success return the cart with message cart cleared

    }

    public async getCartByUserId(userId: string): Promise<any> {
        const cart = await Cart.findOne({ userId }).populate('items.productId', 'productName productPrice');
        
    }

    public async getAllCarts(): Promise<any> {
        const carts = await Cart.find().populate('items.productId', 'name price');
        return carts.map(cart => cart.toObject());
    }

    public async removeCartItem(userId: string, productId: Types.ObjectId): Promise<any> {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
        }

        // Remove the cart item with the specified productId
        cart.items = cart.items.filter(item => item.productId.toString() !== productId.toString());

        // Save the updated cart
        await cart.save();

        return cart.toObject();
    }

    public async checkout(userId: string): Promise<void> {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
        }

        const totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        // Example: Send a payload to the payment service
        this.eventSender.sendEvent({
        name: 'checkout',
        service: 'payment',
        payload: { userId, totalPrice },
        });

        // Additional checkout logic (e.g., clearing the cart, updating order status, etc.)
        // ...

        // Save the updated cart (optional, based on your application's logic)
        // await cart.save();
    }

    
}

export default new CartService(new EventSender());

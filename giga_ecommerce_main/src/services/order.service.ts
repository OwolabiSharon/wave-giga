import Vendor from "../models/sellers/vendor.model";
import SellerOrder from "../models/sellers/sellersOrder.model";
import { OrderModel } from "../models/users/order.model";
import CartModel from "../models/users/cart.model";
import Payment from "../models/general/payment.model";
import { EventSender } from '../utils/eventSystem';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import httpStatus from 'http-status';

export class OrderService {
    private eventSender: EventSender;

    constructor() {
        this.eventSender = new EventSender();
    }

    public async makeOrder(payload: any) {
        try {
            
            const vendor = await Vendor.findOne({ _id: payload.vendorId });
            const cart = await CartModel.findOne({ id: payload.cartId })
            if (vendor) {
                const paymentData = {
                    amount: payload.amount,
                    transactionType: "order"
                }
                const payment = Payment.create(paymentData)

                const orderData = {
                    cart: payload.cartId,
                    payment: payment.id,
                    user: payload.userId
                }
                const order = OrderModel.create(orderData)

                const sellerOrderData = {
                    orderId: order.id,
                    vendorId: vendor.id,
                    items: cart.items
                }
                const sellerOrder = SellerOrder.create(sellerOrderData)

                //pay the order
                this.eventSender.sendEvent({
                    name: 'payFee',
                    service: 'payment', // Assuming 'user' is the service name
                    payload: {token: payload.cardToken, amount: payload.amount, narration: payload.narration, id: payload.vendorId, payment_type: "ecommerce" },
                  })
                return order
              } else {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Seller not found');
            }
            

        } catch (error:any) {
            console.log(error)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something went Wrong');
        }
    }

}

export default new OrderService();


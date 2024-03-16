import Vendor from "../models/sellers/vendor.model";
import SellerOrder from "../models/sellers/sellersOrder.model";
import { OrderModel } from "../models/users/order.model";
import CartModel from "../models/users/cart.model";
import Payment from "../models/general/payment.model";
import { EventSender } from '../utils/eventSystem';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import httpStatus from 'http-status';

export class RefundService {
    private eventSender: EventSender;

    constructor() {
        this.eventSender = new EventSender();
    }

    public async refund(payload: any) {
        try {
            
            const sellersOrder = await SellerOrder.findOne({ _id: payload.orderId });
            if (sellersOrder) {
                const order = await OrderModel.findOne({ _id: sellersOrder.orderId });

                //pay the order
                this.eventSender.sendEvent({
                    name: 'refundUser',
                    service: 'Main',
                    payload: {id: order.user, amount: payload.amount},
                  })
                return order
              } else {
                throw new ApiError(httpStatus.BAD_REQUEST, 'order not found');
            }
            

        } catch (error:any) {
            console.log(error)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something went Wrong');
        }
    }

}

export default new RefundService();
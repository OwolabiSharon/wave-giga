import Vendor from '../models/sellers/vendor.model';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import ApiResponse from '../utils/ApiResponse';
import mongoose, {ObjectId ,Schema} from 'mongoose';
import { EventSender } from '../utils/eventSystem';


export class PaymentService {
    private eventSender: EventSender;

    constructor() {
        this.eventSender = new EventSender();
    }

    public async increaseBalance(payload: any) {
        try{
            const vendor = await Vendor.findOne({ _id: payload.id });
            if (vendor) {
                vendor.earnings = vendor.earnings + payload.amount;
                await vendor.save();

                return vendor;
              } else {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Seller not found');
              }
        } catch (error:any) {
            console.log(error)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something went Wrong');
        }
    }

    public async reduceBalance(payload: any) {
        try{
            const vendor = await Vendor.findOne({ account_number: payload.account_number });//depending on how you structure the db
            if (vendor) {
                vendor.earnings = vendor.earnings - payload.amount;
                await vendor.save();
          
                return vendor;
              } else {
                return("user not found")
              }
        } catch (error:any) {
            console.log(error)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something went Wrong');
        }
    }

    public async withdrawEarnings(data: any) {
        try{
            this.eventSender.sendEvent({
                name: 'transferFunds',
                service: 'payment', 
                payload: { account_bank: data.account_bank, account_number: data.account_number, amount: data.amount }
            });
            return { message: "Pending" }
        } catch (error:any) {
            console.log(error)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something went Wrong');
        }
    }
}

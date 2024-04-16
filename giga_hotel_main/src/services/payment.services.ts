import HotelModel from '../models/hotel.model';
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
            const hotel = await HotelModel.findOne({ _id: payload.id });
            if (hotel) {
                hotel.earnings = hotel.earnings + payload.amount;
                await hotel.save();

                return hotel;
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
            const hotel = await HotelModel.findOne({ account_number: payload.account_number });//depending on how you structure the db
            if (hotel) {
                hotel.earnings = hotel.earnings - payload.amount;
                await hotel.save();
          
                return hotel;
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
            return { message: "Pending", status:httpStatus.OK }
        } catch (error:any) {
            console.log(error)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something went Wrong');
        }
    }
}


export default new PaymentService();
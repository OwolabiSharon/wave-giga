import Driver from '../models/taxiDriver.model';
import Ride from '../models/ride.model';
import httpStatus from 'http-status';
import { EventSender } from '../utils/eventSystem'; 
import ApiError from '../utils/ApiError';
import tomtomApiServices from '../services/tomtomApi.services';
const eventSender = new EventSender();


const increaseBalance = async (data: any) => 
{  
    try {
      const driver = await Driver.findOne({ _id: data.id });

      if (driver) {
        driver.earnings = driver.earnings + data.amount;
        await driver.save();
  
        return driver;
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Selected ride is not in ride offers');
      }
    } catch (error) {
      console.log(error)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went Wrong');
    }
    
  }

  const reduceBalance = async(data: any) => 
{  
  try {
    const driver = await Driver.findOne({ account_number: data.account_number }); //depending on how you structure the db

    if (driver) {
      driver.earnings = driver.earnings - data.amount;
      await driver.save();

      return driver;
    } else {
      return("user not found")
    }
  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went Wrong');
  }
    
  }

  const withdrawEarnings = async(data: any) => 
    {  
        try {
        eventSender.sendEvent({
            name: 'transferFunds',
            service: 'payment', // Assuming 'user' is the service name
            payload: { account_bank: data.account_bank, account_number: data.account_number, amount: data.amount }
        });
            return { message: "Pending" }
            
        } catch (error) {
            console.log(error)
            throw new ApiError(httpStatus.BAD_REQUEST, 'Something went Wrong');
        }
  }
    

  export default {
    increaseBalance,
    reduceBalance,
    withdrawEarnings
  };
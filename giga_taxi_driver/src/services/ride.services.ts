import Driver from '../models/taxiDriver.model';
import Ride from '../models/ride.model';
import httpStatus from 'http-status';
import Rabbit from '../rabbitMq/setup';
import ApiError from '../utils/ApiError';
const rabbit = new Rabbit();



const acceptRide = async (data: any) => {
    const driver = await Driver.findOne({ _id: data.driverId });
    const selectedRide = await Ride.findOne({ _id: data.rideId });

    
  
    if (!selectedRide) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Ride is no longer Available');
    }
  
    if (driver) {
      if (driver.rideOffers.includes(data.rideId)) {
        driver.availability = false;
        driver.currentRide = selectedRide?._id;
        
        // Remove the selected ride from the rideOffers list
        const index = driver.rideOffers.indexOf(data.rideId);
        if (index > -1) {
          driver.rideOffers.splice(index, 1);
        }
   
        selectedRide.status = "Ongoing";
        rabbit.publishMessage('acceptRide', selectedRide);
        await selectedRide.save();
        await driver.save();
  
        return driver.populate('currentRide');
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Selected ride is not in ride offers');
      }
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Perhaps wrong driver Id or na kidnapper');
    }
  };


  const rejectRide = async (data: any) => {
    const driver = await Driver.findOne({ _id: data.driverId });
    const selectedRide = await Ride.findOne({ _id: data.rideId });
  
    if (!selectedRide) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Ride is no longer Available');
    }
  
    if (driver) {
      if (driver.rideOffers.includes(data.rideId)) {
        
        // Remove the selected ride from the rideOffers list
        const index = driver.rideOffers.indexOf(data.rideId);
        if (index > -1) {
          driver.rideOffers.splice(index, 1);
        }
  
        rabbit.publishMessage('rejecrRide', {customerId: selectedRide.customerId });
        await selectedRide.delete();
        await driver.save();
  
        return driver;
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Selected ride is not in ride offers');
      }
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Perhaps wrong driver Id');
    }
  };
  
const createTaxiAccount = async (data: any) => {
    if (await Driver.isUserTaken(data.userID)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User already has a taxi driver account');
    }

    const taxiData = {
      user: data.userID,
      phoneNumber: data.phoneNumber,
      carInformation: data.carInformation,
    };
    
    const driver = await Driver.create(taxiData);
    rabbit.publishMessage('createTaxiProfile', {accountInfo: driver, type: "TaxiDriver"});
    return driver
}; 

const endTrip = async (data: any) => {
    const driver = await Driver.findOne({ _id: data.driverId });
    const currentRide = await Ride.findOne({ _id: data.rideId });

    if(!currentRide)
    {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Ride is no longer Available');
    }
    if(driver)
    {
        driver.availability = true
        driver.currentRide = null
        currentRide.status = "Complete"
        rabbit.publishMessage('EndTrip', {customerId: currentRide.customerId});
        await currentRide.save()
        await driver.save()
        return driver;
    }else
    {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Perhaps wrong driver Id or na kidnapper');
    }
};

const rateCustomer = async(data: any) => 
{  
    try {
      rabbit.publishMessage('rateUser', {userId: data.customerUserId, rating: data.rating});
      return {message: "Rated"}
    } catch (error) {
      console.log(error)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went Wrong');
    }
    
}


export default {
    acceptRide,
    endTrip,
    rateCustomer,
    createTaxiAccount,
    rejectRide
  };
import Rabbit from './setup';
import TaxiModel from '../models/taxiDriver.model';
import RideModel from '../models/ride.model';
import tomtomApiServices from '../services/tomtomApi.services';

const rabbit = new Rabbit();  

const GetRideOffer = async () => {
    //function to do something with the data in the rabbit mq message(add card)
    async function processData(data: any) {
        const {
            driverId,
            driverUserId,
            customerId,
            customerUserId,
            rideType,
            status,
            pickupLocation,
            dropOffLocation,
        } = data
        const pickupLocationString = `${pickupLocation.lat},${pickupLocation.lon}`;
        const dropOffLocationString = `${dropOffLocation.lat},${dropOffLocation.lon}`;
        const driver = await TaxiModel.findOne({ _id: driverId});
        
        try {
          if (driver) {
            const driverLocationString = `${driver.location.coordinates[1]},${driver.location.coordinates[0]}`;
            const pickUpData = await tomtomApiServices.getRoute(driverLocationString, pickupLocationString )
            const mainRideData = await tomtomApiServices.getRoute(pickupLocationString, dropOffLocationString )
            
            const rideData = await RideModel.create({
                driverId,
                driverUserId,
                customerId,
                customerUserId,
                rideType,
                status,
                pickupLocation,
                dropOffLocation,
                distance: mainRideData.summary.lengthInMeters,
                arrivalEta: pickUpData.summary.travelTimeInSeconds,
                rideEta: mainRideData.summary.travelTimeInSeconds
            });
            rabbit.publishMessage('GetRideOfferResponse', {
              distance: rideData.distance,
              arrivalEta: rideData.arrivalEta,
              rideEta: rideData.rideEta 
            });
            driver.rideOffers.push(rideData._id)
            await driver.save()
        } 
        } catch (error) {
          console.log(error);
          
          rabbit.publishMessage('GetRideOfferResponse', "something went wrong");
        }
        
        
    }
      
    // Call consumeMessage and pass the processData function

    rabbit.consumeMessage('GetRideOffer', processData);
};

const getClosestDrivers = async () => { 
  async function findFinalDrivers(targetLocation: any, limit: number, ridePreference: string) {
    
    try {
      const [longitude, latitude] = targetLocation.split(',').map(parseFloat);
      let driverQuery = {
        availability: true,
        driverType: "regular",
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          },
        },
      };

      // If ridePreference is available, add it to the driver query
      if (ridePreference) {
        driverQuery.driverType = ridePreference;
      }
      //add time function
      const finalDrivers = await TaxiModel.find(driverQuery)
        .limit(limit)
        .exec();
      console.log(finalDrivers)

      return finalDrivers;
    } catch (error) {
      // Handle any errors
      console.error('Error finding final drivers:', error);
      throw new Error("Error finding final drivers");
    }
  }

  // Function to process data from the rabbit mq message
  async function processData(data: any) {
    // Perform custom actions with the data
    const { location, ridePreference } = data; // Assuming ridePreference is included in the data
    findFinalDrivers(location, 5, ridePreference)
      .then((drivers) => {
        console.log(drivers);
        
        rabbit.publishMessage('getClosestDriversResponse', drivers);
      })
      .catch((error) => {
        console.log(error);
        rabbit.publishMessage('getClosestDriversResponse', "An error occurred");
      });
  }

  // Call consumeMessage and pass the processData function
  rabbit.consumeMessage('getClosestDrivers',processData );
};

export default {
    GetRideOffer,
    getClosestDrivers
};  
import { NextFunction, Request, response, Response, Router } from "express";
import RideController from "../controllers/ride.controller";
import validate from '../middleware/validate';
import validations from '../validations';


const router = Router();

router
.route('/acceptRide')
.post(validate(validations.ride.acceptRide), RideController.acceptRide)

router
.route('/rejectRide')
.post(validate(validations.ride.acceptRide), RideController.rejectRide)

router
.route('/endTrip')
.post(validate(validations.ride.endTrip), RideController.endTrip)

router
.route('/rateCustomer')
.post(validate(validations.ride.rateCustomer), RideController.rateCustomer)

router 
.route('/createAccount')
.post(validate(validations.ride.createAccount), RideController.createAccount)

router
.route('/getClosestDrivers')
.post(RideController.getClosestDrivers)

router 
.route('/GetRideOffer')
.post(RideController.GetRideOffer)

 
export default router;
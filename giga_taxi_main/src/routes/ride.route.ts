import { NextFunction, Request, response, Response, Router } from "express";
import RideController from "../controllers/ride.controller";
import validate from '../middleware/validate';
import validations from '../validations';


const router = Router();

router
.route('/getClosestDrivers')
.post(validate(validations.ride.getClosestDrivers), RideController.getClosestDrivers)

router
.route('/requestRide')
.post(validate(validations.ride.requestRide ), RideController.requestRide)

router
.route('/rateDriver')
.post(validate(validations.ride.rateDriver), RideController.rateDriver)

router
.route('/createAccount')
.post(validate(validations.ride.createAccount), RideController.createAccount)
 
 
export default router;
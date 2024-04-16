import { NextFunction, Request, response, Response, Router } from "express";
import PaymentController from "../controllers/payment.controller";
import validate from '../middleware/validate';
import validations from '../validations';


const router = Router();

router
.route('/increaseBalance')
.post( PaymentController.increaseBalance)

router
.route('/reduceBalance')
.post(PaymentController.reduceBalance)

router
.route('/withdrawEarnings')
.post(PaymentController.withdrawEarnings)



 
export default router;
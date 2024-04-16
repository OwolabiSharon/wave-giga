import { NextFunction, Request, response, Response, Router } from "express";
import PaymentController from "../controllers/payment.controller";
// import validate from '../middleware/validate';
// import validations from '../validations';


const router = Router();

router
  .route('/transferFunds')
  .post(PaymentController.transferFunds)

router
.route('/paymentWebhook')
  .post(PaymentController.paymentWebhook)



  export default router;
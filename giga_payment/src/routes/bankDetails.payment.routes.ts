import { NextFunction, Request, response, Response, Router } from "express";
import BankDetailsController from "../controllers/bankDetails.payment.controller";
// import validate from '../middleware/validate';
// import validations from '../validations';


const router = Router();

router
  .route('/addBankDetails')
  .post(BankDetailsController.addBankDetails)

router
.route('/kyc')
  .post(BankDetailsController.kyc)


  export default router;
import { NextFunction, Request, response, Response, Router } from "express";
import CreditCardController from "../controllers/creditCard.controller";
// import validate from '../middleware/validate';
// import validations from '../validations';


const router = Router();

router
  .route('/createCard')
  .post(CreditCardController.createCreditCard)

router
.route('/validate')
<<<<<<< HEAD
  .post(CreditCardController.validateTransaction)

router
.route('/payFee')
.post(CreditCardController.payFee)
=======
.post(CreditCardController.validateTransaction)
>>>>>>> 8c3db42 (first commit)

  export default router;
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import creditCardService from '../services/creditCard.service';

export class CreditCardController {
  createCreditCard = catchAsync(async (req: Request, res: Response) => {
        const user = await creditCardService.createCard(req.body.cardNumber, req.body.cardHolderName, req.body.cardExpiryMonth, req.body.cardExpiryYear, req.body.cardCVV, req.body.email, req.body.pin);
    
        res.status(httpStatus.CREATED).send({ message: 'User Created', data: user, status: true });
      });
  validateTransaction = catchAsync(async (req: Request, res: Response) => {
      const creditCard = await creditCardService.validateTransaction(req.body.flutterwaveReference, req.body.otp, req.body.userId);
      res.status(httpStatus.CREATED).send({ message: 'Credit card added', data: creditCard, status: true });
  });

  payFee = catchAsync(async (req: Request, res: Response) => {
    const data = await creditCardService.payFee(req.body);
    res.status(httpStatus.CREATED).send({ message: 'Payment Made', data, status: true });
  });
  
  createAccountDetails = catchAsync(async (req: Request, res: Response) => {
    const data = await creditCardService.createAccountDetails(req.body);
    res.status(httpStatus.CREATED).send({ message: 'Account added', data, status: true });
});

   

}

export default new CreditCardController();






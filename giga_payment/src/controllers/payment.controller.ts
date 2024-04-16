import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ChargeService from '../services/main.service';

export class PaymentController {
    transferFunds = catchAsync(async (req: Request, res: Response) => {
        const user = await ChargeService.transferFunds(req.body);
    
        res.status(httpStatus.CREATED).send({ message: 'User Created', data: user, status: true });
      });
      paymentWebhook = catchAsync(async (req: Request, res: Response) => {
      const creditCard = await ChargeService.paymentWebhook(req.body);
      res.status(httpStatus.CREATED).send({ message: 'Credit card added', data: creditCard, status: true });
  });

  

}

export default new PaymentController();
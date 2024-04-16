import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import rideService from '../services/payment.services';


class PaymentController
{
    increaseBalance = catchAsync(async (req: Request, res: Response) => {
    const data = await rideService.increaseBalance(req.body);
    res.status(httpStatus.CREATED).send({ message: 'Ride Accepted', data: data, status: true });
  });

  reduceBalance = catchAsync(async (req: Request, res: Response) => {
    const data = await rideService.reduceBalance(req.body);
    res.status(httpStatus.CREATED).send({ message: 'Ride Rejected', data: data, status: true });
  });

  withdrawEarnings = catchAsync(async (req: Request, res: Response) => {
    const data = await rideService.withdrawEarnings(req.body);
    res.status(httpStatus.CREATED).send({ message: "Trip Ended", data: data , status: true });
  });

  
}

export default new PaymentController();
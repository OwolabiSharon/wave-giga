import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import bankDetailsService from '../services/bankDetails.services';

export class BankDetailsController {
    addBankDetails = catchAsync(async (req: Request, res: Response) => {
        const bankDetails = await bankDetailsService.addBankDetails(req.body);
    
        res.status(httpStatus.CREATED).send({ message: 'Details added', data: bankDetails, status: true });
  });
    
  kyc = catchAsync(async (req: Request, res: Response) => {
      const kyc_data = await bankDetailsService.kyc(req.body);
      res.status(httpStatus.CREATED).send({ message: 'Kyc Done', data: kyc_data, status: true });
  });


}

export default new BankDetailsController();
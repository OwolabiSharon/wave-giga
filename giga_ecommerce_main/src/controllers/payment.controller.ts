import { Request, Response } from 'express';
import httpStatus from 'http-status';
import PaymentService from '../services/payment.service';


class PaymentController{
    public async increaseBalance(req: Request, res: Response) {
        try {
           // const validatedRequest = SubCategoryZod.createSubCategorySchema.parse(req.body);
            const response = await PaymentService.increaseBalance(req.body);
            return res.status(response.status).json(response);
        } catch (error:any) {
            console.log('Error creating subCategory:', error.message);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    public async reduceBalance(req: Request, res: Response) {
        try {
            const response = await PaymentService.reduceBalance(req.body);
            return res.status(response.status).json(response);
        } catch (error:any) { 
            console.log('Error getting all subCategories:', error.message);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    public async withdrawEarnings(req: Request, res: Response) {
        try {
            const response = await PaymentService.withdrawEarnings(req.body);
            return res.status(response.status).json(response);
        } catch (error:any) { 
            console.log('Error getting all subCategories:', error.message);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

}

export default new PaymentController();
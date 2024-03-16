import { Request, Response } from 'express';
import httpStatus from 'http-status';
import OrderService from '../services/order.service';
import RefundService from '../services/refund.service';

class OrderController{
    public async makeOrder(req: Request, res: Response) {
        try {
           // const validatedRequest = SubCategoryZod.createSubCategorySchema.parse(req.body);
            const response = await OrderService.makeOrder(req.body);
            return res.status(response.status).json(response);
        } catch (error:any) {
            console.log('Error creating subCategory:', error.message);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    public async refund(req: Request, res: Response) {
        try {
            const response = await RefundService.refund(req.body);
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

export default new OrderController();
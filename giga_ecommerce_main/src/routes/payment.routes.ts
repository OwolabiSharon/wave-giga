import { Router } from 'express';
import PaymentController from '../controllers/payment.controller';
import { getAllEndpointsHandler } from '../utils/endpointsUtil';


const router = Router();


router.post('/increase-balance', PaymentController.increaseBalance);
router.get('/reduce-balance', PaymentController.reduceBalance);
router.get('/withdraw-earnings', PaymentController.withdrawEarnings);



export default router;
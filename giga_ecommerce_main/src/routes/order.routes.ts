import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { getAllEndpointsHandler } from '../utils/endpointsUtil';


const router = Router();
const allEndpointsHandler = getAllEndpointsHandler(router);

router.get('/all-endpoints', allEndpointsHandler);//this is for testing purposes only
router.post('/make-order', OrderController.makeOrder);
router.post('/handle-refund', OrderController.refund);



export default router;
import { Router } from "express";
import ridesApi from "./ride.routes";
import paymentApi from "./payment.routes";


const router = Router();
router.use("/driver/v1", ridesApi);
router.use("/driver/payment/v1", paymentApi);



export default router;
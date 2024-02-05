import { Router } from "express";
<<<<<<< HEAD
import appsApi from "./user.routes";
import ecommercePaymentApi from "./ecommerce.payment.routes";
import adsPaymentApi from "./ads.payment.routes";
import hotelsPaymentApi from "./hotels.payment.routes";
import socialMediaPaymentApi from "./social.payment.routes";
import taxiPaymentApi from "./taxi.payment.routes";
import admin from "./admin.payment.routes";
import subAdmin from "./subAdmin.payment.routes";
=======
import bankDetails from "./bankDetails.payment.routes";
>>>>>>> 8c3db42 (first commit)
import creditCard from "./creditcard.routes";


const router = Router();
<<<<<<< HEAD
//this is the sample model introduction method for the payment service
router.use("/payment/v1", appsApi);
//main routes for the payment service
router.use("/payment/v1/creditCard", creditCard);
router.use("/payment/v1/ecommerce", ecommercePaymentApi);
router.use("/payment/v1/ads", adsPaymentApi);
router.use("/payment/v1/hotels", hotelsPaymentApi);
router.use("/payment/v1/social_media", socialMediaPaymentApi);
router.use("/payment/v1/taxi", taxiPaymentApi);
router.use("/payment/v1/admin", admin);
router.use("/payment/v1/subAdmin", subAdmin);
=======
//main routes for the payment service
router.use("/payment/v1/creditCard", creditCard);
router.use("/payment/v1/bankDetails", bankDetails);

>>>>>>> 8c3db42 (first commit)



export default router;
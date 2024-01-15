import { Router } from "express";
import productApi from "./products.routes";
import cartApi from "./cart.routes";
import sellerApi from "./seller.route";


const router = Router();
// router.use("/main/v1", ridesApi);
router.use("/products/v1", productApi);
router.use("/cart/v1", cartApi);
router.use("/seller/V1", sellerApi);




export default router;
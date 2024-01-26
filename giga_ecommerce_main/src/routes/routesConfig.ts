import { Router } from "express";
import productApi from "./products.routes";
import cartApi from "./cart.routes";
import sellerApi from "./seller.route";
import categoryApi from "./category.routes";


const router = Router();
// router.use("/main/v1", ridesApi);
router.use("/products/v1", productApi);
router.use("/cart/v1", cartApi);
router.use("/seller/V1", sellerApi);
router.use("/category/v1", categoryApi);




export default router;
import { Router } from "express";
import appsApi from "./user.routes";
import adminApi from "./admin.routes";
import subAdmin from "./subAdmin.routes";


const router = Router();
router.use("/main/v1", appsApi);
router.use("/admin", adminApi);
router.use("/subAdmin", subAdmin);
export default router;
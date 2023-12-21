import { Router } from "express";
import ridesApi from "./ride.route";


const router = Router();
router.use("/main/v1", ridesApi);



export default router;
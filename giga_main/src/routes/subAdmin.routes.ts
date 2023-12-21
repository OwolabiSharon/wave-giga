import { NextFunction, Request, response, Response, Router } from "express";
import SubAdminController from "../controllers/subAdmin.controller";
import validate from '../middleware/validate';
import validations from '../validations';


const router = Router();


export default router;

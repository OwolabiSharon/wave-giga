import { NextFunction, Request, response, Response, Router } from "express";
import fileUploadController from "../controllers/fileUpload.controller";
import validate from '../middleware/validate';
import validations from '../validations';


const router = Router();

router
  .route('/uploadImage')
  .post(fileUploadController.uploadImage)

router
.route('/deleteImage')
.post(fileUploadController.deleteImage)

export default router;
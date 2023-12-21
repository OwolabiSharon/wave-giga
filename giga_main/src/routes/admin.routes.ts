import { NextFunction, Request, response, Response, Router } from "express";
import AdminController from "../controllers/admin.controller";
import validate from '../middleware/validate';
import validations from '../validations';


const router = Router();

router
  .route('/')
  .post(validate(validations.users.loginUser), AdminController.loginAdmin)

router
.route('/update')
.post(AdminController.updateAdmin)

router
.route('/create')
.post(AdminController.createAdmin)

router
.route('/createSubAdmin')
.post(AdminController.createSubAdmin)






export default router;
import { NextFunction, Request, response, Response, Router } from "express";
import UserController from "../controllers/user.controller";
import validate from '../middleware/validate';
import validations from '../validations';


const router = Router();

router
  .route('/')
  .post(validate(validations.users.createUser), UserController.createUser)

router
.route('/login')
.post(validate(validations.users.loginUser), UserController.loginUser)


router
  .route('/getUser')
  .post(UserController.getUser)

router
.route('/addCard')
.post(UserController.addCard)

router
.route('/rateUser')
.post(UserController.rateUser)

router
.route('/createTaxiAccount')
.post(UserController.createTaxiAccount)
export default router;
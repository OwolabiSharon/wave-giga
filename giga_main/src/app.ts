import express from 'express';
import mongoose from 'mongoose';
import * as dotEnv from 'dotenv';
import router from './routes/routesConfig';
import ApiError from './utils/ApiError';
import rabbit from './rabbitMq/rabbitmq.services';
import admin from './services/admin.service';
import httpStatus from 'http-status';
import cors from 'cors';
import { errorConverter, errorHandler } from './middleware/error';

const app = express();
const port = process.env.PORT || 3000;

dotEnv.config();
// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(router);
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

mongoose.connect(process.env.DB_HOST as string).catch((e) => {
  console.log(e);
}); 

mongoose.connection.on('open', () => {
  console.log('Mongoose  Connection');
});
admin.createAdmin({
  email: "default@default.com",
  password: "defaultPass"
}) 
rabbit.addCard()
rabbit.getUser()
rabbit.rateUser() 
rabbit.createAccount()

app.use(errorConverter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`giga-main-api application is running on port ${port}.`);
});
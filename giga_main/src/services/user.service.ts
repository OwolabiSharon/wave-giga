import UserModel from '../models/user.model';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';
import moment from 'moment';
import { randomString } from '../utils/util';
import { EventSender } from '../utils/eventSystem'; 

const eventSender = new EventSender();
const getUserByEmail = async (email: any) => {
    const user = await UserModel.findOne({ email });

    return user;
};

const getUser = async (id: any) => {
    const user = await UserModel.findById(id);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User deos not exist');
    }

    return user;
};
    

const createUser = async (userBody: any) => {
    if (await UserModel.isEmailTaken(userBody.userName)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    if (await UserModel.isUserNameTaken(userBody.userName)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }

    const emailToken = randomString(6);
    const expires = moment().add(7, 'days');
    const data = {
      ...userBody,
      emailVerificationToken: emailToken,
      emailVerificationExpires: expires,
      isEmailVerified: false,
    };

    const response = await UserModel.create(data);
    
    return response;
};

const loginUser = async (data: any) => {
    const { email } = data;
  
    const user = await getUserByEmail(email);
  
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email or password Invalid');
    }
  
    const compare = await bcrypt.compare(data.password, user.password);
  
    if (compare === false) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email or password invalid');
    }
  
    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        userName: user.userName,
      },
      process.env.JWT_SECRET as string,
      // { expiresIn: '7d' },
    );
  
    return {
      message: 'Login successful',
      data: {
        token,
        user: {
          email: user.email,
          userName: user.userName,
          id: user.id,
        },
      },
    };
};

const verifyEmail = async (data:any ) => {
  const { email, token } = data;
  const user = await getUserByEmail(email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updateEmailStatus = await UserModel.findOneAndUpdate(
    { emailVerificationToken: token, emailVerificationExpires: { $gt: new Date() } },
    { $set: { isEmailVerified: true } },
    { new: true },
  );

  if (!updateEmailStatus) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email verification failed');
  }

  return { message: 'Email verified successfully' };
};

const updateUser = async (data: any) => {
  const {id} = data
  //call the update function from the model
  delete data.id;
  const updates = {
    data
  }
  const updateStatus = await UserModel.updateOne({ _id: id }, updates, function (err:any, docs:any) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated Docs : ", docs);
    }
})
  if (!updateStatus) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Update failed');
  }
  return { message: 'Update successful' };
};

const deleteUser = async (data: any) => {
  const {id} = data
  //call the update function from the model
  const deleteStatus = await UserModel.deleteOne({ _id: id }, function (err:any, docs:any) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Deleted Docs : ", docs);
    }
})
  if (!deleteStatus) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Delete failed');
  }
  return { message: 'Delete successful' };
};

const getAllUsers = async () => {
  const users = await UserModel.find();
  return users;
};


const addCard = async (data: any) => {

  const user = await UserModel.findById(data.userId);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User deos not exist');
  }
  else{
      // Associate the credit card with the user
      user.creditCard = data.card.token;

       // Save the changes to the user document
       await user.save();
       return user;
   }
}

const rateUser = async (data: any) => {

  const user = await UserModel.findById(data.userId);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User deos not exist');
  }
  else{
      user.ratings.push(data.rating)
      user.save()
      return {message: "user rated"}
  }
}

const createTaxiAccount = async (data: any) => {

    const user = await UserModel.findById(data.accountInfo.user);

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User deos not exist');
    }
    else{
        user.taxiProfile = data.accountInfo._id
        user.taxiProfileType = data.type
        user.save()
        return {message: "taxi account created"}
    }
}

const addBankDetails = async (data: any) => {

  const user = await UserModel.findById(data.id);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User deos not exist');
  }
  else{
    const response = (eventSender.sendEvent({
      name: 'createAccountDetails',
      service: 'payment', // Assuming 'user' is the service name
      payload: data,
    })) as any

    return response
  }
}

const refundUser = async (data: any) => {

  const user = await UserModel.findById(data.id).populate('AccountNumber');;

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User deos not exist');
  }
  else{
    const response = (eventSender.sendEvent({
      name: 'transferFunds',
      service: 'payment', // Assuming 'user' is the service name
      payload: {
        account_bank: user.AccountNumber.accountNumber,
        account_number: user.AccountNumber.bankName ,
        amount: data.amount
      },
    })) as any

    return response
  }
}


export default {
    createUser,
    getUser,
    loginUser,
    verifyEmail,
    updateUser,
    deleteUser,
    getAllUsers,
    addCard,
    rateUser,
    createTaxiAccount,
  addBankDetails,
  refundUser
  };
import subAdminModel from '../models/subAdmin.model';
import AdminModel from '../models/admin.model';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';

import { randomString } from '../utils/util';
import { generateChangeToken,generateTwoFactorAuthDetails } from '../utils/util';


const getSubAdminByEmail = async (email: any) => {
    const user = await subAdminModel.findOne({ email });

    return user;
};

const createSubAdmin = async (subAdminBody: any) => {    
    if (await subAdminModel.isUserNameTaken("SubAdmin")) {
        console.log("subAdmin setup")
        return;
    }
    //check if the admin creating the new subAdmin is an admin using the admin ID
    const admin = await AdminModel.findOne({ _id: subAdminBody.adminId });
    if (!admin) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Admin not found');
    }
    //generate a changeKey for the subAdmin 
    const changeKey = generateChangeToken();
    //generate a twoFactorAuth for the subAdmin and assign both the secretKey, otpAuthURL from the generateTwoFactorAuthDetails function
    const {secretKey, otpAuthURL} = generateTwoFactorAuthDetails();
    //hash the twoFactorAuth
    const hashedTwoFactorAuthKey = await bcrypt.hash(secretKey, 10);
    //hash the change Key
    const hashedChangeKey = await bcrypt.hash(changeKey, 10);
    //add the twoFactorAuth details to the subAdminBody
    subAdminBody.twoFactorAuthSecret = hashedTwoFactorAuthKey;
    //hash the password
    const hashedPassword = await bcrypt.hash(subAdminBody.password, 10);
    //add the changeKey and hashedPassword to the subAdminBody
    subAdminBody.changeKey = hashedChangeKey;
    subAdminBody.password = hashedPassword;

    //create the subAdmin
    const data = {
        ...subAdminBody,
        otpAuthURL

    };
    //look for a way to send the changeKey to the subAdmin's email
    try {
    return subAdminModel.create(data);
    } catch (error: any ) {
    throw new Error(error)
    }
    
};

const loginSubAdmin = async (data: any) => {
    const { email } = data;
    const subAdmin = await getSubAdminByEmail(email);

    if (!subAdmin) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email or password Invalid');
    }
    
    const compare = await bcrypt.compare(data.password, subAdmin.password);
    
    if (compare === false) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email or password Invalid');
    }
    
    //check if the subAdmin has an active two factor authentication the name of the field is dualAuth
    if (subAdmin.dualAuth === true) {
        //check if the 2fa key is in the request body
        if (!data.twoFactorAuth) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Two Factor Authentication Required');
        }
        //check if the 2fa key is correct
        if (data.twoFactorAuth !== subAdmin.twoFactorAuth) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Two Factor Authentication Required');
        }
    }
    //generate a 2fa key for the subAdmi

    //set the Active status of the subAdmin to true and save
    subAdmin.active = true;
    await subAdmin.save();


    const token = jwt.sign({ id: subAdmin._id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    
    return {
        token,
        subAdmin,
    };
};

// const updateSubAdminPassword = async (data: any) => {
//     const { email, password, token } = data;
//     const subAdmin = await getSubAdminByEmail(email);
//     if (!subAdmin) {
//         throw new ApiError(httpStatus.UNAUTHORIZED, 'Email or password Invalid');
//     }
    




export default {
    getSubAdminByEmail,
    createSubAdmin,
    loginSubAdmin,
};

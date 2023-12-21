import Joi from 'joi';
import { password, objectId } from './custom.validation';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    userName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    otherNames: Joi.string(),
  }),
};


const loginUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const loginSubAdmin = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    twoFactorCode: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    token: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
};

const updatePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

const createSubAdmin = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    userName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    otherNames: Joi.string(),
  }),
};


export default {
  loginUser,
  createUser,
  resetPassword,
  forgotPassword,
  updatePassword,
  createSubAdmin,
  loginSubAdmin,
};

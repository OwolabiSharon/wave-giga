import AdminModel from '../models/admin.model';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';

const getAdminByEmail = async (email: any) => {
    const user = await AdminModel.findOne({ email });

    return user;
};

const createAdmin = async (adminBody: any) => {

  if (await AdminModel.isUserNameTaken("Admin")) {
      console.log("admin setup")
      return;
  }

  const data = {
      ...adminBody
  };
  try {
    return AdminModel.create(data);
  } catch (error: any ) {
    throw new Error(error)
  }

};

const updateAdmin = async (data: any) => {
  const {id} = data
  delete data.id;
  const updates = {
    data
  }
  await AdminModel.updateOne({ _id: id }, updates, function (err:any, docs:any) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated Docs : ", docs);
    }
})
  
  return AdminModel.create(data);
};

const loginAdmin = async (data: any) => {
    const { email } = data;
  
    const admin = await getAdminByEmail(email);
  
    if (!admin) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email or password Invalid');
    }
  
    const compare = await bcrypt.compare(data.password, admin.password);
  
    if (compare === false) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email or password invalid');
    }
  
    const token = jwt.sign(
      {
        email: admin.email,
        _id: admin._id,
        userName: admin.userName,
      },
      process.env.JWT_SECRET as string,
      // { expiresIn: '7d' },
    );
  
    return {
      message: 'Login successful',
      data: {
        token
      },
    };
};



export default {
    createAdmin,
    updateAdmin,
    loginAdmin
  };
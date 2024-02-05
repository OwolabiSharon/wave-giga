import { v2 as cloudinary } from 'cloudinary';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

cloudinary.config({ 
    cloud_name: 'ubeus', 
    api_key: '296351691679173', 
    api_secret: 'Avhi-xgZfwe18yje5MAO1YCA2v4' 
  });
  console.log("test");
  
  
  const UploadFile = async (file: any) => {
      try {
          console.log("test 2");
        // eslint-disable-next-line camelcase
        const { public_id, url } = await cloudinary.uploader.upload(file, {
          resource_type: 'auto',
          folder: 'startupia',
        });
        console.log({ public_id, url });
        
        return { public_id, url };
      } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
      }
 };


const DeleteFile = async (pictureId: any) => {
  try {
    await cloudinary.uploader.destroy(pictureId);
    return;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

export default {
  UploadFile,
  DeleteFile,
};
 
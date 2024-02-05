import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import cloudinaryService from '../services/cloudinary.service';

class FileUploadController {
    uploadImage = catchAsync(async (req: any, res: Response) => {
        if (req.file && req.file.path) {
            const upload = await cloudinaryService.UploadFile(req.file.path);
            if (upload && upload.url) {
            //   vendor.logo = { url: upload.url, id: upload.public_id };
            }
            res.status(httpStatus.CREATED).send({ message: 'Admin Updated', data: upload, status: true });
          }
          res.status(httpStatus.CREATED).send({ message: 'Went wrong somewhere', data: "Error", status: true });
    
    });
    
    deleteImage = catchAsync(async (req: any, res: Response) => {
            const deletePic = await cloudinaryService.UploadFile(req.body.pictureId);
            res.status(httpStatus.CREATED).send({ message: 'Picture Deleted', data: deletePic , status: true });
    
  });
}

export default new FileUploadController();
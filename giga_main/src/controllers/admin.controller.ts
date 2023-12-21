import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import adminService from '../services/admin.service';
import subAdminService from '../services/subAdmin.service';

class AdminController {
  updateAdmin = catchAsync(async (req: Request, res: Response) => {
    const admin = await adminService.updateAdmin(req.body);

    res.status(httpStatus.CREATED).send({ message: 'Admin Updated', data: admin, status: true });
  });

  loginAdmin = catchAsync(async (req: Request, res: Response) => {
    const data = await adminService.loginAdmin(req.body);

    res.status(httpStatus.CREATED).send({ message: data.message, data: data.data, status: true });
  });

  createAdmin = catchAsync(async (req: Request, res: Response) => {
    const admin = await adminService.createAdmin(req.body);

    res.status(httpStatus.CREATED).send({ message: 'Admin Created', data: admin, status: true });
  });

  createSubAdmin = catchAsync(async (req: Request, res: Response) => {
    const subAdmin = await subAdminService.createSubAdmin(req.body);

    res.status(httpStatus.CREATED).send({ message: 'SubAdmin Created', data: subAdmin, status: true });
  });
}

export default new AdminController();
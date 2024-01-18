import { Request, Response } from 'express';
import httpStatus from 'http-status';
import categoryService from '../services/category.service';
import CategoryZod from '../validations/categories.model.zod';


class categoryController {
    async createCategory(req: Request, res: Response) {
        try {
            const categoryBody = CategoryZod.createCategorySchema.parse(req.body);
            //Remember to add cloudinary image function here 
            const category = await categoryService.create(categoryBody);
            res.status(httpStatus.CREATED).send(category);
        } catch (error) {
            res.status(httpStatus.BAD_REQUEST).send(error);
        }
    }

    async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await categoryService.findAll();
            res.status(httpStatus.OK).send(categories);
        } catch (error) {
            res.status(httpStatus.BAD_REQUEST).send(error);
        }
    }

    async getCategoryByName(req: Request, res: Response) {
        try {
            const categoryBody = CategoryZod.findOneSchema.parse(req.body);
            const category = await categoryService.findOne(categoryBody.categoryName);
            res.status(httpStatus.OK).send(category);
        } catch (error) {
            res.status(httpStatus.BAD_REQUEST).send(error);
        }
    }

    async deleteCategory(req: Request, res: Response) {
        try {
            const categoryBody = CategoryZod.deleteOneSchema.parse(req.body);
            const category = await categoryService.deleteOne(categoryBody.categoryName);
            res.status(httpStatus.OK).send(category);
        } catch (error) {
            res.status(httpStatus.BAD_REQUEST).send(error);
        }
    }
}

export default new categoryController();
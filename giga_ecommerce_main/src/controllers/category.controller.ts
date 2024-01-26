import { Request, Response } from 'express';
import httpStatus from 'http-status';
import categoryService from '../services/category.service';
import CategoryZod from '../validations/categories.model.zod';


class categoryController {
    async createCategory(req: Request, res: Response) {
            const categoryBody = CategoryZod.createCategorySchema.parse(req.body);
            //Remember to add cloudinary image function here 
            const category = await categoryService.create(categoryBody);
            res.status(httpStatus.CREATED).send(category);

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

    async deleteMultipleCategories(req: Request, res: Response) {
        try {
            const categoryBody = CategoryZod.deleteMultipleSchema.parse(req.body);
            const category = await categoryService.deleteMultiple(categoryBody.categoryNames);
            res.status(httpStatus.OK).send(category);
        } catch (error) {
            res.status(httpStatus.BAD_REQUEST).send(error);
        }
    }

    async updateCategory(req: Request, res: Response) {
        try {
            const categoryBody = CategoryZod.updateCategorySchema.parse(req.body);
            const category = await categoryService.update(categoryBody.categoryName, categoryBody);
            res.status(httpStatus.OK).send(category);
        } catch (error) {
            res.status(httpStatus.BAD_REQUEST).send(error);
        }
    }

    async addSubCategory(req: Request, res: Response) {
        try {
            const categoryBody = CategoryZod.addSubCategorySchema.parse(req.body);
            const category = await categoryService.addSubCategory(categoryBody.categoryName, categoryBody.subCategoryName);
            res.status(httpStatus.OK).send(category);
        } catch (error) {
            res.status(httpStatus.BAD_REQUEST).send(error);
        }
    }

    async removeSubCategory(req: Request, res: Response) {
        try {
            const categoryBody = CategoryZod.removeSubCategorySchema.parse(req.body);
            const category = await categoryService.removeSubCategory(categoryBody.categoryName, categoryBody.subCategoryName);
            res.status(httpStatus.OK).send(category);
        } catch (error) {
            res.status(httpStatus.BAD_REQUEST).send(error);
        }
    }

    async addProduct(req: Request, res: Response) {
        try {
            const categoryBody = CategoryZod.addProductSchema.parse(req.body);
            const category = await categoryService.addProduct(categoryBody.categoryName, categoryBody.productName, categoryBody.VendorId);
            res.status(httpStatus.OK).send(category);
        } catch (error) {
            res.status(httpStatus.BAD_REQUEST).send(error);
        }
    }

    async removeProduct(req: Request, res: Response) {
        try {
            const categoryBody = CategoryZod.removeProductSchema.parse(req.body);
            const category = await categoryService.removeProduct(categoryBody.categoryName, categoryBody.productName, categoryBody.VendorId);
            res.status(httpStatus.OK).send(category);
        } catch (error) {
            res.status(httpStatus.BAD_REQUEST).send(error);
        }
    }


}

export default new categoryController();
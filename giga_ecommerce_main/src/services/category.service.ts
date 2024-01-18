import Category from "../models/general/category.model";
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const create = async (categoryBody: any) => {
    const category = await Category.create(categoryBody);
    return category;
};

const findAll = async () => {
    const categories = await Category.find();
    return categories;
};

const findOne = async (categoryName: string)=> {
    const category = await Category.findOne({categoryName});
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }

    return category;
};

const deleteOne = async (categoryName: string) => {
    const category = await findOne(categoryName);
    await category.remove();
    return category;
}

export default {
    create,
    findAll,
    findOne,
    deleteOne
};
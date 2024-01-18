import Category from "../models/general/category.model";
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const create = async (categoryBody: any) => {
    //check if category already exists
    if (Category.isCategoryTaken(categoryBody.categoryName)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Category already taken');
    }
    const category = await Category.create(categoryBody);
    //return category and send back response that the category has been created
    return {category, message: 'Category created'};
};

const findAll = async () => {
    const categories = await Category.find();
    // if the array is empty, send back response that no categories exist not an error 404 
    if (categories.length === 0) {
        return {message: 'No categories exist'};
    }
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

    if (!category) {
        // Category not found, return a response with a message and 404 status code
        return {
            statusCode: 404,
            isOperational: true,
            status: 'fail',
            message: 'Category not found'
        };
    }

    await category.remove();
    // Send back response that the category has been deleted
    return {
        statusCode: 200,
        isOperational: true,
        status: 'success',
        message: 'Category deleted'
    };
};

const deleteMultiple = async (categoryNames: string[]) => {
    const categories = await Category.find({categoryName: {$in: categoryNames}});
    if (!categories) {
        // Category not found, return a response with a message and 404 status code
        return {
            statusCode: 404,
            isOperational: true,
            status: 'fail',
            message: 'Categories not found'
        };
    }
    //if 1 of the categories is not found then delete the others and flag that/those categories were not found
    if (categories.length !== categoryNames.length) {
        //delete the categories that were found
        await Category.deleteMany({categoryName: {$in: categories}});
        //return a response with a message and 404 status code
        return {
            statusCode: 404,
            isOperational: true,
            status: 'fail',
            message: 'Some categories were not found'
        };
    }

    await Category.deleteMany({categoryName: {$in: categoryNames}});
    // Send back response that the categories have been deleted
    return {
        statusCode: 200,
        isOperational: true,
        status: 'success',
        message: 'Categories deleted'
    };
}

export default {
    create,
    findAll,
    findOne,
    deleteOne,
    deleteMultiple
};
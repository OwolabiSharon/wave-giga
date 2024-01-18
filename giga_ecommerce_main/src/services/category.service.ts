import Category from "../models/general/category.model";
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const create = async (categoryBody: any) => {
    try {
        // Check if category name is provided
        if (!categoryBody || !categoryBody.categoryName) {
            return { statusCode: httpStatus.BAD_REQUEST, message: 'Category name is required' };
        }

        // Check if category already exists
        const isCategoryTaken = await Category.isCategoryTaken(categoryBody.categoryName);
        if (isCategoryTaken) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Category name is required');
        }

        // Check if categoryBody has valid properties
        const validProperties = ['categoryName', 'categoryDescription', 'categoryImage'];
        const isValidBody = validProperties.every(prop => categoryBody.hasOwnProperty(prop));

        if (!isValidBody) {
            return { statusCode: httpStatus.BAD_REQUEST, message: 'Invalid category body' };
        }

        // Create the category
        const createdCategory = await Category.create(categoryBody);

        // Check if the category was created successfully
        if (createdCategory) {
            return { statusCode: httpStatus.OK, category: createdCategory, message: 'Category created' };
        } else {
            return { statusCode: httpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to create category' };
        }
    } catch (error) {
        // Handle any unexpected errors
        return { statusCode: httpStatus.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' };
    }
};

const findAll = async () => {
    try {
        const categories = await Category.find();

        // Case: No categories exist
        if (categories.length === 0) {
            return { message: 'No categories exist' };
        }

        // Case: Categories exist
        return categories;
    } catch (error:any) {
        // Handle unexpected errors
        console.error(error);
        // Case: MongoDB error
        if (error.name === 'MongoError') {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'MongoDB Error');
        }
        // Case: Other unexpected errors
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};

const findOne = async (categoryName: string) => {
    try {
        const category = await Category.findOne({ categoryName });

        if (!category) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
        }

        return category;
    } catch (error: any) {
        // Handle unexpected errors
        console.error(error);

        // Case: MongoDB error
        if (error.name === 'MongoError') {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'MongoDB Error');
        }

        // Case: Other unexpected errors
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};


const deleteOne = async (categoryName: string) => {
    //if there is no value in the category variable then return a response with a message and 404 status code no category has been passed in
    if (!categoryName || categoryName.trim() === '') {
        return {
            statusCode: 400,
            isOperational: true,
            status: 'fail',
            message: 'Category name is required'
        };
    }

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

const update = async (categoryName: string, updatedData: any) => {
    try {
        // Find the category to update
        const category = await Category.findOne({ categoryName });

        // If the category doesn't exist, throw a 404 error
        if (!category) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
        }

        // Update the category with the new data
        Object.assign(category, updatedData);
        
        // Save the updated category to the database
        await category.save();

        // Return the updated category
        return { statusCode: httpStatus.OK, category, message: 'Category updated successfully' };
    } catch (error: any) {
        // Handle unexpected errors
        console.error(error);

        // Case: MongoDB error
        if (error.name === 'MongoError') {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'MongoDB Error');
        }

        // Case: Other unexpected errors
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
};




export default {
    create,
    findAll,
    findOne,
    deleteOne,
    deleteMultiple,
    update,
};
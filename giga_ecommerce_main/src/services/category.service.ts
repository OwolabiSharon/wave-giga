import Category from "../models/general/category.model";
import Product from "../models/general/product.model";
import subCategory from "../models/general/subCategory.model";
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
            throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
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

const addSubCategory = async (categoryName: any, subCategoryName: any) => {
    //check if the CategoryNam and subCategoryName are ObjectsIds or not, if they are not then convert them to ObjectIds
    if (typeof categoryName !== 'object') {
        categoryName = Category.getCategoryObjectId(categoryName);
        //if the categoryName is null then return a response with a message and 404 status code
        if (!categoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Category not found'
            };
        }
        //if the category does not exist then return a response with a message and 404 status code
        if (!categoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Category not found'
            };
        }
    }
    if (typeof subCategoryName !== 'object') {
        subCategoryName = await subCategory.getSubCategoryObjectId(subCategoryName);
        //if the subCategoryName is null then return a response with a message and 404 status code
        if (!subCategoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Subcategory not found'
            };
        }
        //if the subcategory does not exist then return a response with a message and 404 status code
        if (!subCategoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Subcategory not found'
            };
        }
    }

    //check if the subcategory is already in the category
    const subCategoryInCategory = Category.isSubCategoryInCategory(categoryName, subCategoryName);
    //if the subcategory is already in the category then return a response with a message and 404 status code
    if (subCategoryInCategory) {
        return {
            statusCode: 404,
            isOperational: true,
            status: 'fail',
            message: 'Subcategory already in category'
        };
    }

    try{
        //add the subcategory to the category
        await Category.updateOne({ _id: categoryName }, { $push: { categorySubCategories: subCategoryName } });
        //return a response with a message and 200 status code
        return {
            statusCode: 200,
            isOperational: true,
            status: 'success',
            message: 'Subcategory added to category'
        };
    }catch(err){
        //return a response with a message and 500 status code
        console.error(err);
        return {
            statusCode: 500,
            isOperational: true,
            status: 'fail',
            //send message with the error
            message: err
        };
    
    }
    

}

const removeSubCategory = async (categoryName: any, subCategoryName: any) => {
    //check if the CategoryNam and subCategoryName are ObjectsIds or not, if they are not then convert them to ObjectIds
    if (typeof categoryName !== 'object') {
        categoryName = Category.getCategoryObjectId(categoryName);
        //if the categoryName is null then return a response with a message and 404 status code
        if (!categoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Category not found'
            };
        }
        //if the category does not exist then return a response with a message and 404 status code
        if (!categoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Category not found'
            };
        }
    }
    if (typeof subCategoryName !== 'object') {
        subCategoryName = await subCategory.getSubCategoryObjectId(subCategoryName);
        //if the subCategoryName is null then return a response with a message and 404 status code
        if (!subCategoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Subcategory not found'
            };
        }
        //if the subcategory does not exist then return a response with a message and 404 status code
        if (!subCategoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Subcategory not found'
            };
        }
    }

    //check if the subcategory is already in the category
    const subCategoryInCategory = Category.isSubCategoryInCategory(categoryName, subCategoryName);
    //if the subcategory is already in the category then return a response with a message and 404 status code
    if (!subCategoryInCategory) {
        return {
            statusCode: 404,
            isOperational: true,
            status: 'fail',
            message: 'Subcategory not in category'
        };
    }

    try{
        //remove the subcategory from the category
        await Category.updateOne({ _id: categoryName }, { $pull: { categorySubCategories: subCategoryName } });
        //return a response with a message and 200 status code
        return {
            statusCode: 200,
            isOperational: true,
            status: 'success',
            message: 'Subcategory removed from category'
        };
    }catch(err){
        //return a response with a message and 500 status code
        console.error(err);
        return {
            statusCode: 500,
            isOperational: true,
            status: 'fail',
            //send message with the error
            message: err
        };
    
    }

}

const addProduct = async (categoryName: any, productName: any ,vendorId:any) => {
    //check if the CategoryNam and productName are ObjectsIds or not, if they are not then convert them to ObjectIds
    if (typeof categoryName !== 'object') {
        categoryName = Category.getCategoryObjectId(categoryName);
        //if the categoryName is null then return a response with a message and 404 status code
        if (!categoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Category not found'
            };
        }
        //if the category does not exist then return a response with a message and 404 status code
        if (!categoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Category not found'
            };
        }
    }

    if (typeof productName !== 'object') {
        productName = await Product.getProductObjectId(productName, vendorId);
        //if the productName is null then return a response with a message and 404 status code
        if (!productName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Product not found'
            };
        }
        //if the product does not exist then return a response with a message and 404 status code
        if (!productName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Product not found'
            };
        }
    }

    //check if the product is already in the category
    const productInCategory = Category.isProductInCategory(categoryName, productName);
    //if the product is already in the category then return a response with a message and 404 status code
    if (productInCategory) {
        return {
            statusCode: 404,
            isOperational: true,
            status: 'fail',
            message: 'Product already in category'
        };
    }

    try{
        //add the product to the category
        await Category.updateOne({ _id: categoryName }, { $push: { categoryProducts: productName } });
        //return a response with a message and 200 status code
        return {
            statusCode: 200,
            isOperational: true,
            status: 'success',
            message: 'Product added to category'
        };
    }catch(err){
        //return a response with a message and 500 status code
        console.error(err);
        return {
            statusCode: 500,
            isOperational: true,
            status: 'fail',
            //send message with the error
            message: err
        };
    
    }

}

const removeProduct = async (categoryName: any, productName: any, vendorId: any) => {
    //check if the CategoryNam and productName are ObjectsIds or not, if they are not then convert them to ObjectIds
    if (typeof categoryName !== 'object') {
        categoryName = Category.getCategoryObjectId(categoryName);
        //if the categoryName is null then return a response with a message and 404 status code
        if (!categoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Category not found'
            };
        }
        //if the category does not exist then return a response with a message and 404 status code
        if (!categoryName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Category not found'
            };
        }
    }

    if (typeof productName !== 'object') {
        productName = await Product.getProductObjectId(productName, vendorId);
        //if the productName is null then return a response with a message and 404 status code
        if (!productName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Product not found'
            };
        }
        //if the product does not exist then return a response with a message and 404 status code
        if (!productName) {
            return {
                statusCode: 404,
                isOperational: true,
                status: 'fail',
                message: 'Product not found'
            };
        }
    }

    //check if the product is already in the category
    const productInCategory = Category.isProductInCategory(categoryName, productName);
    //if the product is already in the category then return a response with a message and 404 status code
    if (!productInCategory) {
        return {
            statusCode: 404,
            isOperational: true,
            status: 'fail',
            message: 'Product not in category'
        };
    }

    try{
        //remove the product from the category
        await Category.updateOne({ _id: categoryName }, { $pull: { categoryProducts: productName } });
        //return a response with a message and 200 status code
        return {
            statusCode: 200,
            isOperational: true,
            status: 'success',
            message: 'Product removed from category'
        };
    }catch(err){
        //return a response with a message and 500 status code
        console.error(err);
        return {
            statusCode: 500,
            isOperational: true,
            status: 'fail',
            //send message with the error
            message: err
        };
    }
}
export default {
    create,
    findAll,
    findOne,
    deleteOne,
    deleteMultiple,
    update,
    addSubCategory,
    removeSubCategory,
    addProduct,
    removeProduct
};
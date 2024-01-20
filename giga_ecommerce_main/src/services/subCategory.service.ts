import { PaginatedResults, paginate } from '../models/general/paginate.model';
import SubCategory  from '../models/general/subCategory.model';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status'


const createSubCategory = async (subCategory: any) => {
    // Check if category name is provided
    if (!subCategory || !subCategory.subCategoryName) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Subcategory name is required');
    }

    // Check if subcategory already exists
    if (await SubCategory.isSubCategoryNameTaken(subCategory.subCategoryName)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Subcategory name already taken');
    }
    // Check if subcategoryBody has valid properties
    const validProperties = ['subCategoryName', 'subCategoryDescription', 'subCategoryImage'];
    const isValidBody = validProperties.every(prop => subCategory.hasOwnProperty(prop));

    if (!isValidBody) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid subcategory body');
    }

    // Check if the subcategory was created successfully
    const createdSubCategory = await SubCategory.create(subCategory);
    if (!createdSubCategory) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create subcategory');
    }

    return createdSubCategory;
};

const findAllSubCategories = async () => {
    const subCategories = await SubCategory.find();

    // Case: No subcategories exist
    if (subCategories.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No subcategories exist');
    }

    // Case: Subcategories exist
    return subCategories;
};
import Category from "src/models/general/category.model";
import SubCategory from "src/models/general/subCategory.model";


const getAllCategories = async () => {
    const categories = await Category.find().populate('categorySubCategories').populate('categoryProducts');

    return categories;
};

const getCategoryByName = async (categoryName: any) => {
    const category = await Category.findOne({ categoryName }).populate('categorySubCategories').populate('categoryProducts');

    return category;
}
//needs the category ID 
const updateCategoryName = async (data: any) => {
    const { id, categoryName } = data;
    const category = await Category.findOne({ _id: id });

    if (category) {
        category.categoryName = categoryName;
        await category.save();
    }

    return category;
};

const updateCategoryDescription = async (data: any) => {
    const { id, categoryDescription } = data;
    const category = await Category.findOne({ _id: id });

    if (category) {
        category.categoryDescription = categoryDescription;
        await category.save();
    }

    return category;
};

const addSubCategoryToCategory = async (data: any) => {
    const { id, subCategoryName } = data;
    const category = await Category.findOne({ _id: id });
    const subCategory = await SubCategory.findOne({ subCategoryName });

    if (category && subCategory) {
        category.categorySubCategories.push(subCategory._id);
        await category.save();
    }

    return category;
};

const removeSubCategoryFromCategory = async (data: any) => {
    const { id, subCategoryName } = data;
    const category = await Category.findOne({ _id: id });
    const subCategory = await SubCategory.findOne({ subCategoryName });

    if (category && subCategory) {
        category.categorySubCategories = category.categorySubCategories.filter((subCategory: any) => subCategory.subCategoryName !== subCategoryName);
        await category.save();
    }

    return category;
};


//sub categories

//use the category Name/ID to get the category
const getAllSubCategories = async (categoryName: any) => {
    const category = await Category.findOne({ categoryName }).populate('categorySubCategories').populate('categoryProducts');
    const subCategories = category?.categorySubCategories;

    return subCategories;
};

const getSubCategoryByName = async (categoryName: any, subCategoryName: any) => {
    const category = await Category.findOne({ categoryName }).populate('categorySubCategories').populate('categoryProducts');
    const subCategory = await SubCategory.findOne({ subCategoryName }).populate('subCategoryProducts');

    return subCategory;
};

const updateSubCategoryName = async (data: any) => {
    const { id, subCategoryName } = data;
    const subCategory = await SubCategory.findOne({ _id: id });

    if (subCategory) {
        subCategory.subCategoryName = subCategoryName;
        await subCategory.save();
    }

    return subCategory;
};

const updateSubCategoryDescription = async (data: any) => {
    const { id, subCategoryDescription } = data;
    const subCategory = await SubCategory.findOne({ _id: id });

    if (subCategory) {
        subCategory.subCategoryDescription = subCategoryDescription;
        await subCategory.save();
    }

    return subCategory;
};

const updateSubCategoryImage = async (data: any) => {
    const { id, subCategoryImage } = data;
    const subCategory = await SubCategory.findOne({ _id: id });

    if (subCategory) {
        subCategory.subCategoryImage = subCategoryImage;
        await subCategory.save();
    }

    return subCategory;
}

const createSubCategory = async (data: any) => {
    const { categoryName, subCategoryName, subCategoryDescription, subCategoryImage } = data;
    const category = await Category.findOne({ categoryName }).populate('categorySubCategories').populate('categoryProducts');

    if (category) {
        const subCategory = await SubCategory.create({
            subCategoryName,
            subCategoryDescription,
            subCategoryImage
        });

        category.categorySubCategories.push(subCategory._id);
        await category.save();

        return subCategory;
    }

    return null;
};

const deleteSubCategory = async (data: any) => {
    const { categoryName, subCategoryName } = data;
    const category = await Category.findOne({ categoryName }).populate('categorySubCategories').populate('categoryProducts');
    const subCategory = await SubCategory.findOne({ subCategoryName }).populate('subCategoryProducts');

    if (category && subCategory) {
        category.categorySubCategories = category.categorySubCategories.filter((subCategory: any) => subCategory.subCategoryName !== subCategoryName);
        await category.save();

        await subCategory.delete();
    }

    return subCategory;
};


export default {
    getAllCategories,
    getCategoryByName,
    updateCategoryName,
    updateCategoryDescription,
    addSubCategoryToCategory,
    removeSubCategoryFromCategory,
    getAllSubCategories,
    getSubCategoryByName,
    updateSubCategoryName,
    updateSubCategoryDescription,
    updateSubCategoryImage,
    createSubCategory,
    deleteSubCategory
};
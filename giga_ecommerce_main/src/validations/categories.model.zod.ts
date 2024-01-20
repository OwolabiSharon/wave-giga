import { z } from "zod";

const createCategorySchema = z.object({
    //zods that are required
    categoryName: z.string().min(1).max(255),
    categoryDescription: z.string().min(1).max(255),
    categoryImage: z.string().min(1).max(255),
    //zods that are not required
    categorySubCategories: z.array(z.string()),
});



const findOneSchema = z.object({
    categoryName: z.string().min(1).max(255),
});

const deleteOneSchema = z.object({
    categoryName: z.string().min(1).max(255),
});

const deleteMultipleSchema = z.object({
    // require at least one category name
    categoryNames: z.array(z.string()).min(1),
});

const updateCategorySchema = z.object({
    // You can customize the schema based on the fields you want to allow for updating
    categoryName: z.string(),
    // Example: Allow updating categoryDescription and categoryImage
    categoryDescription: z.string().optional(),
    categoryImage: z.string().optional(),
});

const addSubCategorySchema = z.object({
    categoryName: z.string().min(1).max(255),
    subCategoryName: z.string().min(1).max(255),
});



export default {
    createCategorySchema,
    updateCategorySchema,
    findOneSchema,
    deleteOneSchema,
    deleteMultipleSchema,
    addSubCategorySchema
};
import { z } from "zod";

const createCategorySchema = z.object({
    //zods that are required
    categoryName: z.string().min(1).max(255),
    categoryDescription: z.string().min(1).max(255),
    categoryImage: z.string().min(1).max(255),
    //zods that are not required
    categorySubCategories: z.array(z.string()),
});

const updateCategorySchema = z.object({
    categoryName: z.string(),
    categoryDescription: z.string(),
    categoryImage: z.string(),
    categorySubCategories: z.array(z.string()),
});

const findOneSchema = z.object({
    categoryName: z.string(),
});

const deleteOneSchema = z.object({
    categoryName: z.string(),
});


export default {
    createCategorySchema,
    updateCategorySchema,
    findOneSchema,
    deleteOneSchema,
};
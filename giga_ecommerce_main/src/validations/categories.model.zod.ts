import { z } from "zod";

const createCategorySchema = z.object({
    categoryName: z.string(),
    categoryimage: z.string(),
    categoryDescription: z.string(),
    categoryImage: z.string(),
    categorySubCategories: z.array(z.string()),
});

const updateCategorySchema = z.object({
    categoryName: z.string(),
    categoryDisplayName: z.string(),
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
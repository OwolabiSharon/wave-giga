import { z } from "zod";

const createProductSchema = z.object({
    vendor: z.string(),
    shop: z.string(),
    productName: z.string(),
    productDisplayName: z.string(),
    productDescription: z.string(),
    productCategory: z.string(),
    productSubCategory: z.string(),
    productImages: z.array(z.string()),
    productPrice: z.number(),
    productAmountInStock: z.number(),
    productFulfilmentTime: z.number(),
});

const ProductFufilmentSchema = z.object({
    vendorId: z.string(),
    shop: z.string(),
    productName: z.string(),
    productFufilmentTime: z.number(),
});

const ProductRestockSchema = z.object({
    vendorId: z.string(),
    shop: z.string(),
    productName: z.string(),
    productAmountInStock: z.number(),
});

const ProductDeleteSchema = z.object({
    vendorId: z.string(),
    shop: z.string(),
    productName: z.string(),
});

const ProductFindSchema = z.object({
    productName: z.string(),
});


//export zod schema
export default {
    createProductSchema,
    ProductFufilmentSchema,
    ProductRestockSchema,
    ProductDeleteSchema,
    ProductFindSchema,
};

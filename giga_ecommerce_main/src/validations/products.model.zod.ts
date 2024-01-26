import { paginate } from "src/models/general/paginate.model";
import { z } from "zod";

const createProductSchema = z.object({
    vendor: z.string().min(1),
    shop: z.string().min(1),
    productName: z.string().min(1),
    productDisplayName: z.string().min(1),
    productDescription: z.string().min(1),
    productCategory: z.string().min(1),
    productSubCategory: z.string().min(1),
    productImages: z.array(z.string()).min(1),
    productPrice: z.number().min(1),
    productAmountInStock: z.number().min(1),
    productFulfilmentTime: z.number().min(1),
});

const ProductFufilmentSchema = z.object({
    vendorId: z.string().min(1),
    shop: z.string().min(1),
    productName: z.string().min(1),
    productFufilmentTime: z.number().min(1),
});

const ProductRestockSchema = z.object({
    vendorId: z.string().min(1),
    shop: z.string().min(1),
    productName: z.string().min(1),
    productAmountInStock: z.number().min(1),
});

const ProductDeleteSchema = z.object({
    vendorId: z.string().min(1),
    shop: z.string().min(1),
    productName: z.string().min(1),
});

const ProductFindSchema = z.object({
    paginateNumber: z.number().min(1),
    paginateSize: z.number().min(1),
    productName: z.string().min(1),
});

const ProductFindAllSchema = z.object({
    paginateNumber: z.number().min(1),
    paginateSize: z.number().min(1),
});

const ProductFindByIdSchema = z.object({
    productId: z.string().min(1),
});

const findByCategorySchema = z.object({
    paginateNumber: z.number().min(1),
    paginateSize: z.number().min(1),
    productCategory: z.string().min(1),
});



//export zod schema
export default {
    createProductSchema,
    ProductFufilmentSchema,
    ProductRestockSchema,
    ProductDeleteSchema,
    ProductFindSchema,
    ProductFindAllSchema,
    ProductFindByIdSchema,
    findByCategorySchema,
};

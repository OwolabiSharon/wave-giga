import { z } from "zod";

const ProductSchema = z.object({
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
    vendor: z.string(),
    shop: z.string(),
    productName: z.string(),
    productFufilmentTime: z.number(),
});

//export zod schema
export default ProductSchema;

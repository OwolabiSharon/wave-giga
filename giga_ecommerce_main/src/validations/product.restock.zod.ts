import { z } from "zod";

const ProductRestockSchema = z.object({
    vendor: z.string(),
    shop: z.string(),
    productName: z.string(),
    productAmountInStock: z.number(),
});

export type ProductRestock = z.infer<typeof ProductRestockSchema>;
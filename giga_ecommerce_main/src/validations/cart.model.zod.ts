import { z } from "zod";

const CartSchema = z.object({
    id: z.string(),
    userId: z.string(),
    items: z.array(
        z.object({
            productId: z.string(),
            quantity: z.number().positive(),
        })
    ),
    createdAt: z.date(),
});

export type Cart = z.infer<typeof CartSchema>;

export default CartSchema;

import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
  quantity: z.coerce
    .number()
    .int()
    .min(0, "Quantity must be a positive integer"),
});

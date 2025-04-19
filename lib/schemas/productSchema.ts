import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a valid number",
  }),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  description: z.string().optional(),
});

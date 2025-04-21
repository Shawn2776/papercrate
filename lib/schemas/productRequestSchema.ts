import { z } from "zod";

export const productRequestSchema = z.object({
  name: z.string().min(1, "Product name is required."),
  price: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  qrCodeUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  description: z.string().optional(),
  variant: z.string().optional(),
  category: z.string().optional(),
  tenantId: z.string().optional(), // 👈 important for multi-tenant support
});

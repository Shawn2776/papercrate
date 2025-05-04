import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  rate: z.coerce.number().min(0, "Price must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
});

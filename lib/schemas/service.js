import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  rate: z.coerce.number().min(0, "Rate is required"),
  unit: z.string().min(1, "Unit is required (e.g. hour, job)"),
});

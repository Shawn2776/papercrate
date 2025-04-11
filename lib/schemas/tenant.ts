import { z } from "zod";

export const TenantCreateSchema = z.object({
  legalBusinessName: z.string().min(2),
  businessEmail: z.string().email().optional(),
  onlineLink: z.string().url().optional(),
  businessType: z.string(),
  businessCategory: z.string(),
  businessSubcategory: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
});

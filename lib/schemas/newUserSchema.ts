// lib/schemas/newUserSchema.ts
import { z } from "zod";

export const newUserSchema = z.object({
  businessType: z.string().min(2),
  businessCategory: z.string().min(2),
  businessSubcategory: z.string().min(2),
  legalBusinessName: z.string().min(2),
  doingBusinessAs: z.string().optional(),
  ein: z.string().min(9).max(15),
  businessState: z.string().min(2),
  onlineStatus: z.enum(["online", "notOnline"]),
  onlineLink: z.string().url().optional(),
  tenantId: z.string().optional(),
});

export type NewUserForm = z.infer<typeof newUserSchema>;

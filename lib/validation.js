import { z } from "zod";

export const businessTypeSchema = z.object({
  businessType: z.enum(
    [
      "individual",
      "sole-proprietorship",
      "partnership",
      "llc",
      "corporation",
      "unincorporated",
    ],
    {
      errorMap: () => ({ message: "You must select a valid business type" }),
    }
  ),
});

export const businessCategorySchema = z.object({
  businessCategory: z.enum(
    [
      "retail-misc",
      "food-hospitality",
      "professional",
      "health-beauty",
      "services",
      "clothing",
      "leisure",
      "retail",
      "other",
    ],
    { errorMap: () => ({ message: "You must select a valid category" }) }
  ),
});

export const businessSubcategorySchema = z.object({
  businessSubcategory: z
    .string()
    .min(1, "You must select or enter a subcategory"),
});

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

export const invoiceSchema = z.object({
  id: z.number(),
  status: z.string(),
  amount: z.string(),
  customer: z.string(),
  createdAt: z.string(),
});

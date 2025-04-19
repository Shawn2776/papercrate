// lib/schemas/onboardingSchema.ts
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
    {
      errorMap: () => ({ message: "You must select a valid category" }),
    }
  ),
});

export const businessSubcategorySchema = z.object({
  businessSubcategory: z
    .string()
    .min(1, "You must select or enter a subcategory"),
});

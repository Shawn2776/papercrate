import { z } from "zod";

export const initialBusinessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  email: z.string().email("Invalid email address"),
});

export const fullBusinessSchema = initialBusinessSchema.extend({
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(15, "Phone number must be no more than 15 digits"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(), // Optional, but not nullable
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z
    .string()
    .min(5, "Postal code must be at least 5 characters")
    .max(10, "Postal code must be no more than 10 characters"),
  website: z
    .string()
    .url("Invalid website URL")
    .nullable()
    .or(z.literal(""))
    .optional(),
});

import { z } from "zod";

// Used during business creation (/setup-business)
export const initialBusinessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  email: z.string().email("Invalid email address"),
});

// Used before issuing invoices or showing a complete profile
export const fullBusinessSchema = initialBusinessSchema.extend({
  phone: z.string().min(7, "Phone number is required").optional(),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  website: z.string().url("Invalid URL").optional(),
});

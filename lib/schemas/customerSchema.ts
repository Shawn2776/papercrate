// lib/schemas/customerSchema.ts
import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Valid email is required."),
  phone: z.string().min(1, "Phone number is required."),

  billingAddressLine1: z.string().min(1, "Billing address line 1 is required."),
  billingAddressLine2: z.string().optional(),
  billingCity: z.string().min(1, "Billing city is required."),
  billingState: z.string().min(1, "Billing state is required."),
  billingZip: z.string().min(1, "Billing ZIP is required."),

  shippingAddressLine1: z
    .string()
    .min(1, "Shipping address line 1 is required."),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z.string().min(1, "Shipping city is required."),
  shippingState: z.string().min(1, "Shipping state is required."),
  shippingZip: z.string().min(1, "Shipping ZIP is required."),

  notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

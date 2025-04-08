// lib/schemas/customer.ts
import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Valid email is required."),
  phone: z.string().min(1, "Phone number is required."),
  address: z.string().min(1, "Address is required."),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

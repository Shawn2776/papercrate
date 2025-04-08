import { z } from "zod";

// Reusable line item schema
export const lineItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .min(1, "Quantity must be at least 1"),
  discountId: z.string().optional().nullable(),
});

// Main invoice form schema
export const invoiceFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  status: z.string().min(1, "Status is required"),
  lineItems: z
    .array(lineItemSchema)
    .min(1, "At least one line item is required"),
  taxRateId: z.string().optional().nullable(),
  taxExempt: z.boolean().optional(),
  taxExemptId: z.string().optional().nullable(),
});

// Inferred types
// ✅ Export the inferred types
export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

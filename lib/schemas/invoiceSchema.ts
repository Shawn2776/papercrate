import { z } from "zod";
import { InvoiceStatus } from "@prisma/client";

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

// Invoice form schema (frontend)
export const invoiceFormSchema = z
  .object({
    customerId: z.string().min(1, "Customer is required"),
    status: z.nativeEnum(InvoiceStatus),
    notes: z.string().optional(),
    lineItems: z
      .array(lineItemSchema)
      .min(1, "At least one line item is required"),
    taxRateId: z.string().optional().nullable(),
    invoiceDate: z.string().min(1, "Date is required"),
    taxExempt: z.boolean().optional(),
    taxExemptId: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.taxExempt && !data.taxExemptId) {
      ctx.addIssue({
        path: ["taxExemptId"],
        code: z.ZodIssueCode.custom,
        message: "Tax Exempt ID is required when tax is exempted.",
      });
    }
  });

// ✅ This is what you're missing:
export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
export type InvoiceInput = InvoiceFormValues;

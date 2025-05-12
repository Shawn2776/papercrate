import { z } from "zod";

// Define the allowed statuses
export const InvoiceStatus = z.enum(["DRAFT", "SENT", "PAID", "CANCELED"]);

// Define the main invoice schema
export const invoiceSchema = z.object({
  id: z.string().cuid(),
  number: z.string().min(1).max(50),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid decimal value"),
  dueDate: z.date().min(new Date(), "Due date must be in the future"),
  businessId: z.string().cuid(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deleted: z.boolean().default(false),
  status: InvoiceStatus.default("DRAFT"),
});

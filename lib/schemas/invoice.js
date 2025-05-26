// lib>schemas>invoice.jsx

import { z } from "zod";

export const invoiceSchema = z.object({
  businessId: z.string(),
  customerId: z.string().nullable().optional(),
  invoiceDate: z.string(),
  dueDate: z.string(),
  status: z.enum([
    "DRAFT",
    "SENT",
    "PAID",
    "PARTIALLY_PAID",
    "OVERDUE",
    "CANCELLED",
    "VOID",
  ]),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      unit: z.string(),
      quantity: z.number().min(1),
      rate: z.number().min(0),
    })
  ),
});

// import { z } from "zod";

// export const InvoiceStatus = z.enum(["DRAFT", "SENT", "PAID", "CANCELED"]);

// export const invoiceSchema = z.object({
//   id: z.string().cuid(),
//   number: z.string().min(1).max(50),
//   amount: z
//     .string()
//     .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid decimal value"),
//   dueDate: z.date().min(new Date(), "Due date must be in the future"),
//   businessId: z.string().cuid(),
//   createdAt: z.date().optional(),
//   updatedAt: z.date().optional(),
//   deleted: z.boolean().default(false),
//   status: InvoiceStatus.default("DRAFT"),
// });

// export const lineItemSchema = z.object({
//   name: z.string().min(1),
//   description: z.string().optional(),
//   unit: z.string().min(1),
//   quantity: z.number().min(1),
//   rate: z.number().min(0),
// });

// export const createInvoiceSchema = z.object({
//   customerId: z.string().cuid(),
//   dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
//     message: "Invalid date format",
//   }),
//   poNumber: z.string().optional(),
//   invoiceNumber: z.string().optional(),
//   terms: z.string().optional(),
//   lineItems: z.array(lineItemSchema).min(1),
// });

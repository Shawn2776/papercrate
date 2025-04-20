import { Customer } from "@prisma/client";

export type PartialCustomer = Omit<
  Customer,
  "createdAt" | "updatedAt" | "createdById" | "updatedById"
>;

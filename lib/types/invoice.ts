import { Prisma } from "@prisma/client";

export type InvoiceWithRelations = Prisma.InvoiceGetPayload<{
  include: {
    customer: true;
    tenant: true;
    InvoiceDetail: {
      include: {
        Product: true;
        Discount: true;
      };
    };
  };
}>;

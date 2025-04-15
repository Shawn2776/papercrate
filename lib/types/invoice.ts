import { Prisma } from "@prisma/client";

export type InvoiceWithRelations = Prisma.InvoiceGetPayload<{
  include: {
    customer: true;
    tenant: {
      include: {
        InvoiceSettings: true;
      };
    };
    InvoiceDetail: {
      include: {
        Product: true;
        Discount: true;
        TaxRate: true;
      };
    };
  };
}>;

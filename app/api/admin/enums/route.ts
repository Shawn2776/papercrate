import { currentUser } from "@clerk/nextjs/server";
import {
  Role,
  TenantRole,
  Permission,
  InvoiceStatus,
  PaymentType,
  ProductIdentifierType,
  PlanTier,
} from "@prisma/client";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  return Response.json({
    role: Object.values(Role),
    tenantRole: Object.values(TenantRole),
    permission: Object.values(Permission),
    invoiceStatus: Object.values(InvoiceStatus),
    paymentType: Object.values(PaymentType),
    productIdentifierType: Object.values(ProductIdentifierType),
    planTier: Object.values(PlanTier),
  });
}

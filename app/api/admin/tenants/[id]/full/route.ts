import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { NextRequest } from "next/server";
import { getTenantIdFromUrl } from "@/lib/url/getTenantIdFromUrl";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const tenantId = getTenantIdFromUrl(req);
  if (!tenantId) {
    return new Response("Missing tenant ID", { status: 400 });
  }

  try {
    const [memberships, invoices, customers, products] = await Promise.all([
      prisma.tenantMembership.findMany({
        where: { tenantId },
        select: {
          role: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              deleted: true,
            },
          },
        },
      }),
      prisma.invoice.findMany({ where: { tenantId } }),
      prisma.customer.findMany({ where: { tenantId } }),
      prisma.product.findMany({ where: { tenantId } }),
    ]);

    const users = memberships.map((m) => ({
      ...m.user,
      tenantRole: m.role,
    }));

    return Response.json({
      users,
      invoices,
      customers,
      products,
    });
  } catch (error) {
    console.error("[/api/admin/tenants/[id]/full] Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

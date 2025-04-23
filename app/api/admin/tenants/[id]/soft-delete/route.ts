// app/api/admin/tenants/[id]/restore/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { NextRequest } from "next/server";
import { getTenantIdFromUrl } from "@/lib/url/getTenantIdFromUrl";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function PATCH(req: NextRequest) {
  const user = await currentUser();

  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  try {
    const tenantId = getTenantIdFromUrl(req);
    if (!tenantId) {
      return new Response("Missing tenant ID", { status: 400 });
    }

    try {
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { deleted: true },
      });

      return new Response("Tenant restored", { status: 200 });
    } catch (error) {
      console.error("[/api/admin/tenants/[id]/full] Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  } catch (error) {
    console.error("[/api/admin/tenants/[id]/full] Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

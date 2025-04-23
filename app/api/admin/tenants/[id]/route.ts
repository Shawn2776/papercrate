// app/api/admin/tenants/[id]/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function DELETE(request: Request) {
  const user = await currentUser();

  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const tenantId = segments[segments.indexOf("tenants") + 1];

  if (!tenantId) {
    return new Response("Missing tenant ID", { status: 400 });
  }

  try {
    await prisma.tenant.delete({
      where: { id: tenantId },
    });

    return new Response("Tenant permanently deleted", { status: 200 });
  } catch (error) {
    console.error("Hard delete error:", error);
    return new Response("Failed to hard delete tenant", { status: 500 });
  }
}

// app/api/admin/tenants/[id]/route.ts
import { softDeleteTenant } from "@/lib/functions/softDeleteTenant";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
): Promise<Response> {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const { id: tenantId } = context.params;

  try {
    await softDeleteTenant(tenantId);
    return new Response("Tenant soft-deleted", { status: 200 });
  } catch (err) {
    console.error("Error deleting tenant:", err);
    return new Response("Failed to delete tenant", { status: 500 });
  }
}

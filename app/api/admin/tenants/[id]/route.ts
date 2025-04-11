import { currentUser } from "@clerk/nextjs/server";
import { softDeleteTenant } from "@/lib/functions/softDeleteTenant";

export const runtime = "nodejs"; // 👈 prevents edge validation bug

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const user = await currentUser();

  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const tenantId = context.params.id;

  try {
    await softDeleteTenant(tenantId);
    return new Response("Tenant soft-deleted", { status: 200 });
  } catch (error) {
    console.error("Soft delete error:", error);
    return new Response("Failed to delete tenant", { status: 500 });
  }
}

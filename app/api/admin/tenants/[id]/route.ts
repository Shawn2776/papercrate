import { currentUser } from "@clerk/nextjs/server";
import { softDeleteTenant } from "@/lib/functions/softDeleteTenant";

export const runtime = "nodejs";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function DELETE(request: Request) {
  const user = await currentUser();

  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  // ✅ Extract tenant ID from URL manually
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const tenantId = segments[segments.indexOf("tenants") + 1];

  if (!tenantId) {
    return new Response("Missing tenant ID", { status: 400 });
  }

  try {
    await softDeleteTenant(tenantId);
    return new Response("Tenant soft-deleted", { status: 200 });
  } catch (error) {
    console.error("Soft delete error:", error);
    return new Response("Failed to delete tenant", { status: 500 });
  }
}

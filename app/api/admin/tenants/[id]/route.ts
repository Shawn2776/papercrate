import { currentUser } from "@clerk/nextjs/server";
import { softDeleteTenant } from "@/lib/functions/softDeleteTenant";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

type RouteContext = {
  params: {
    id: string;
  };
};

export async function DELETE(
  req: Request,
  context: RouteContext
): Promise<Response> {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const tenantId = context.params.id;

  try {
    await softDeleteTenant(tenantId);
    return new Response("Tenant soft-deleted", { status: 200 });
  } catch (err) {
    console.error("Error deleting tenant:", err);
    return new Response("Failed to delete tenant", { status: 500 });
  }
}

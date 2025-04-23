// app/api/admin/tenants/[id]/restore/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  try {
    await prisma.tenant.update({
      where: { id: params.id },
      data: { deleted: false },
    });

    return new Response("Tenant restored", { status: 200 });
  } catch (error) {
    console.error("Restore error:", error);
    return new Response("Failed to restore tenant", { status: 500 });
  }
}

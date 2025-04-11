// app/api/admin/tenants/[id]/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const id = params.id;
  const existing = await prisma.tenant.findUnique({ where: { id } });
  if (!existing) return new Response("Not found", { status: 404 });

  await prisma.$transaction([
    prisma.tenant.delete({ where: { id } }),
    prisma.auditLog.create({
      data: {
        action: "DELETE",
        entityType: "Tenant",
        entityId: id,
        before: existing,
        after: { deleted: true },
        userId: user.id,
      },
    }),
  ]);

  return new Response("Deleted", { status: 200 });
}

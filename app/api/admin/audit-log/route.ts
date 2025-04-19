// app/api/admin/audit-log/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function GET() {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { performedAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
    take: 100,
  });

  return Response.json(logs);
}

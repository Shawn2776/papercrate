// app/api/admin/tenants/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") ?? "active";
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") ?? "10", 10);

  const whereClause =
    filter === "deleted"
      ? { deleted: true }
      : filter === "all"
      ? undefined
      : { deleted: false };

  const [tenants, total] = await Promise.all([
    prisma.tenant.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.tenant.count({ where: whereClause }),
  ]);

  return Response.json({ tenants, total });
}

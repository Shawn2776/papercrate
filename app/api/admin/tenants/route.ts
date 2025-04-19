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
  const showDeleted = url.searchParams.get("deleted") === "true";

  const tenants = await prisma.tenant.findMany({
    where: showDeleted ? undefined : { deleted: false }, // avoids `{}` as a "no filter"
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return Response.json(tenants);
}

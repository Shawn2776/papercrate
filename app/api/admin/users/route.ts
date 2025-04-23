// app/api/admin/users/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function GET(req: NextRequest) {
  const authUser = await currentUser();
  if (!authUser || authUser.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const filter = searchParams.get("filter") || "active";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const where =
    filter === "deleted"
      ? { deleted: true }
      : filter === "active"
      ? { deleted: false }
      : {};

  const users = await prisma.user.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: {
      memberships: {
        select: {
          role: true,
          tenant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.user.count({ where });

  const formattedUsers = users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    deleted: user.deleted,
    isTenantOwner: user.memberships.some((m) => m.role === "OWNER"),
    hasNoTenants: user.memberships.length === 0,
    memberships: user.memberships.map((m) => ({
      tenantName: m.tenant.name,
      role: m.role,
    })),
  }));

  return Response.json({ users: formattedUsers, total });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDbUserOrThrow } from "@/lib/functions/getDbUser";
import { hasPermission } from "@/lib/utils/permissions";
import { Permission, TenantRole } from "@prisma/client";

export async function GET() {
  const user = await getDbUserOrThrow();

  if (!hasPermission(user, Permission.VIEW_AUDIT_LOGS)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get tenant IDs where user is OWNER or ADMIN
  const memberships = await prisma.tenantMembership.findMany({
    where: {
      userId: user.id,
      role: { in: [TenantRole.OWNER, TenantRole.ADMIN] },
      deleted: false,
    },
    select: { tenantId: true },
  });

  const tenantIds = memberships.map((m) => m.tenantId);
  if (tenantIds.length === 0) {
    return NextResponse.json([], { status: 200 }); // No access = no users
  }

  // Find user IDs in those tenants
  const memberUsers = await prisma.tenantMembership.findMany({
    where: {
      tenantId: { in: tenantIds },
      deleted: false,
    },
    select: { userId: true },
  });

  const userIds = [...new Set(memberUsers.map((m) => m.userId))];

  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
      deleted: false,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(users);
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Permission, TenantRole } from "@prisma/client";
import { getDbUserOrThrow } from "@/lib/functions/getDbUser";
import { hasPermission } from "@/lib/utils/permissions";

export async function GET(req: NextRequest) {
  const user = await getDbUserOrThrow();

  if (!hasPermission(user, Permission.VIEW_AUDIT_LOGS)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Find their tenant memberships and restrict to OWNER / ADMIN roles
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
    return NextResponse.json(
      { error: "Not authorized for any tenant logs" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? undefined;
  const entityType = searchParams.get("entityType") ?? undefined;
  const userId = searchParams.get("userId") ?? undefined;

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(action && { action }),
      ...(entityType && { entityType }),
      ...(userId && { userId }),
      // Only show logs where the user belongs to a tenant the current user owns/admins
      user: {
        memberships: {
          some: {
            tenantId: { in: tenantIds },
            deleted: false,
          },
        },
      },
    },
    orderBy: { performedAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true, id: true } },
    },
  });

  return NextResponse.json(logs);
}

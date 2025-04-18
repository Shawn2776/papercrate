import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Permission } from "@prisma/client";
import { getDbUserOrThrow } from "@/lib/functions/getDbUser";
import { hasPermission } from "@/lib/utils/permissions";

export async function GET(req: NextRequest) {
  const user = await getDbUserOrThrow();

  if (!hasPermission(user, Permission.VIEW_AUDIT_LOGS)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    },
    orderBy: { performedAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true, id: true } },
    },
  });

  return NextResponse.json(logs);
}

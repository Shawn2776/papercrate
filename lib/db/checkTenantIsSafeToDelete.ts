// lib/utils/checkTenantIsSafeToDelete.ts
import { prisma } from "@/lib/db/prisma";

export async function checkTenantIsSafeToDelete(
  tenantId: string
): Promise<boolean> {
  const activeUserIds = (
    await prisma.user.findMany({
      where: { deleted: false },
      select: { id: true },
    })
  ).map((u) => u.id);

  const activeMembers = await prisma.tenantMembership.findMany({
    where: {
      tenantId,
      userId: { in: activeUserIds },
    },
  });

  return activeMembers.length === 0;
}

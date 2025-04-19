// lib/utils/softDeleteTenant.ts
import { prisma } from "@/lib/db/prisma";

export async function softDeleteTenant(tenantId: string) {
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

  if (activeMembers.length > 0) {
    throw new Error("Tenant has active users. Remove them first.");
  }

  await prisma.tenant.update({
    where: { id: tenantId },
    data: { deleted: true },
  });

  await Promise.all([
    prisma.business.updateMany({
      where: { tenantId },
      data: { deleted: true },
    }),
    prisma.product.updateMany({ where: { tenantId }, data: { deleted: true } }),
    prisma.customer.updateMany({
      where: { tenantId },
      data: { deleted: true },
    }),
    prisma.invoice.updateMany({ where: { tenantId }, data: { deleted: true } }),
    prisma.order.updateMany({ where: { tenantId }, data: { deleted: true } }),
    prisma.invoiceSettings.updateMany({
      where: { tenantId },
      data: { layout: "classic" },
    }),
    prisma.tenantMembership.deleteMany({ where: { tenantId } }),
  ]);
}

// lib/utils/softDeleteUser.ts
import { prisma } from "@/lib/db/prisma";

export async function softDeleteUser(userId: string, includeOwned = false) {
  await prisma.user.update({
    where: { id: userId },
    data: { deleted: true },
  });

  if (!includeOwned) return;

  await Promise.all([
    prisma.business.updateMany({
      where: { createdById: userId },
      data: { deleted: true },
    }),
    prisma.product.updateMany({
      where: { createdById: userId },
      data: { deleted: true },
    }),
    prisma.invoice.updateMany({
      where: { createdById: userId },
      data: { deleted: true },
    }),
    prisma.customer.updateMany({
      where: { createdById: userId },
      data: { deleted: true },
    }),
    prisma.shippingDetail.updateMany({
      where: { createdById: userId },
      data: { deleted: true },
    }),
    prisma.discount.updateMany({
      where: { createdById: userId },
      data: { deleted: true },
    }),
    prisma.taxRate.updateMany({
      where: { createdById: userId },
      data: { deleted: true },
    }),
    prisma.payment.updateMany({
      where: { createdById: userId },
      data: { deleted: true },
    }),
  ]);
}

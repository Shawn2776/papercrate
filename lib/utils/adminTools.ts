// lib/utils/adminTools.ts
import { prisma } from "@/lib/prisma";
import { Prisma, Permission } from "@prisma/client";

export async function softDeleteTenant(tenantId: string) {
  const memberships = await prisma.tenantMembership.findMany({
    where: { tenantId },
    include: { user: true },
  });

  const ownerMembership = memberships.find((m) => m.role === "OWNER");

  if (!ownerMembership) throw new Error("No OWNER found for this tenant.");

  const activeMembers = memberships.filter((m) => !m.user.deleted);
  if (activeMembers.length > 0) {
    console.warn(
      `Warning: This tenant has ${activeMembers.length} active user(s). Proceeding with soft delete.`
    );
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

  await prisma.auditLog.create({
    data: {
      action: "SOFT_DELETE",
      entityType: "Tenant",
      entityId: tenantId,
      userId: ownerMembership.userId,
    },
  });
}

export async function softDeleteUser(userId: string, tenantId?: string) {
  await prisma.user.update({ where: { id: userId }, data: { deleted: true } });

  if (!tenantId) return;

  await Promise.all([
    prisma.business.updateMany({
      where: {
        tenantId,
        OR: [{ createdById: userId }, { updatedById: userId }],
      },
      data: { deleted: true },
    }),
    prisma.product.updateMany({
      where: {
        tenantId,
        OR: [{ createdById: userId }, { updatedById: userId }],
      },
      data: { deleted: true, isActive: false },
    }),
    prisma.invoice.updateMany({
      where: {
        tenantId,
        OR: [{ createdById: userId }, { updatedById: userId }],
      },
      data: { deleted: true },
    }),
    prisma.customer.updateMany({
      where: {
        tenantId,
        OR: [{ createdById: userId }, { updatedById: userId }],
      },
      data: { deleted: true },
    }),
    prisma.tenantMembership.deleteMany({ where: { tenantId, userId } }),
  ]);

  await prisma.auditLog.create({
    data: {
      action: "SOFT_DELETE",
      entityType: "User",
      entityId: userId,
      userId: userId,
    },
  });
}

export async function restoreUser(
  userId: string,
  tenantId: string,
  adminId: string
) {
  const SUPERADMIN_ID = process.env.SUPERADMIN_ID;
  if (adminId !== SUPERADMIN_ID) {
    throw new Error("Unauthorized: Only the superadmin can restore users.");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { deleted: false },
  });

  await Promise.all([
    prisma.business.updateMany({
      where: {
        tenantId,
        OR: [{ createdById: userId }, { updatedById: userId }],
      },
      data: { deleted: false },
    }),
    prisma.product.updateMany({
      where: {
        tenantId,
        OR: [{ createdById: userId }, { updatedById: userId }],
      },
      data: { deleted: false, isActive: true },
    }),
    prisma.invoice.updateMany({
      where: {
        tenantId,
        OR: [{ createdById: userId }, { updatedById: userId }],
      },
      data: { deleted: false },
    }),
    prisma.customer.updateMany({
      where: {
        tenantId,
        OR: [{ createdById: userId }, { updatedById: userId }],
      },
      data: { deleted: false },
    }),
  ]);

  await prisma.auditLog.create({
    data: {
      action: "RESTORE",
      entityType: "User",
      entityId: userId,
      userId: adminId,
    },
  });

  return user;
}

export async function restoreUserToMultipleTenants(
  userId: string,
  tenantIds: string[],
  adminId: string
) {
  for (const tenantId of tenantIds) {
    await restoreUser(userId, tenantId, adminId);
  }
}

export async function checkTenantIsSafeToDelete(
  tenantId: string
): Promise<boolean> {
  const activeMembers = await prisma.tenantMembership.findMany({
    where: {
      tenantId,
      user: { is: { deleted: false } },
    },
  });
  return activeMembers.length === 0;
}

export async function updateUserPermissions(
  userId: string,
  permissions: Permission[] = [],
  adminId: string
) {
  const SUPERADMIN_ID = process.env.SUPERADMIN_ID;
  if (adminId !== SUPERADMIN_ID) {
    throw new Error(
      "Unauthorized: Only the superadmin can update permissions."
    );
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      memberships: {
        updateMany: {
          where: { userId },
          data: { permissions: { set: permissions } },
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "UPDATE",
      entityType: "User",
      entityId: userId,
      after: { permissions: [...permissions] },
      userId: adminId,
    },
  });

  return result;
}

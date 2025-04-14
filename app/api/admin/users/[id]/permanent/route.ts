import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authUser = await currentUser();
  if (!authUser || authUser.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const userId = params.id;

  try {
    const memberships = await prisma.tenantMembership.findMany({
      where: { userId },
      select: {
        tenantId: true,
        role: true,
      },
    });

    const ownerTenants = memberships
      .filter((m) => m.role === "OWNER")
      .map((m) => m.tenantId);

    const nonOwnerTenants = memberships
      .filter((m) => m.role !== "OWNER")
      .map((m) => m.tenantId);

    // 🔥 For OWNER, delete their tenant-scoped data
    await Promise.all(
      ownerTenants.map(async (tenantId) => {
        await prisma.business.deleteMany({
          where: {
            tenantId,
            OR: [{ createdById: userId }, { updatedById: userId }],
          },
        });

        await prisma.product.deleteMany({
          where: {
            tenantId,
            OR: [{ createdById: userId }, { updatedById: userId }],
          },
        });

        await prisma.invoice.deleteMany({
          where: {
            tenantId,
            OR: [{ createdById: userId }, { updatedById: userId }],
          },
        });

        await prisma.customer.deleteMany({
          where: {
            tenantId,
            OR: [{ createdById: userId }, { updatedById: userId }],
          },
        });

        await prisma.tenantMembership.deleteMany({
          where: { tenantId, userId },
        });
      })
    );

    // ✅ Remove non-owner memberships
    if (nonOwnerTenants.length > 0) {
      await prisma.tenantMembership.deleteMany({
        where: {
          tenantId: { in: nonOwnerTenants },
          userId,
        },
      });
    }

    // 🧾 Soft-delete Audit Logs
    await prisma.auditLog.updateMany({
      where: { userId },
      data: { deleted: true },
    });

    // 💀 Delete user
    await prisma.user.delete({ where: { id: userId } });

    // 📘 Log the deletion
    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entityType: "User",
        entityId: userId,
        userId: authUser.id,
      },
    });

    return new Response("User permanently deleted", { status: 200 });
  } catch (err) {
    console.error("Failed to permanently delete user:", err);
    return new Response("Error deleting user", { status: 500 });
  }
}

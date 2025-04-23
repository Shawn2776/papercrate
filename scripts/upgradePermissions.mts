// scripts/upgradePermissions.ts (example)
import { prisma } from "../lib/db/prisma";
import { Permission } from "@prisma/client";

// Add new customer-related permissions to all relevant roles
async function main() {
  const memberships = await prisma.tenantMembership.findMany();

  for (const membership of memberships) {
    const newPermissions: Permission[] = [...membership.permissions];

    if (membership.role === "OWNER") {
      newPermissions.push(
        Permission.CREATE_CUSTOMER,
        Permission.VIEW_CUSTOMERS,
        Permission.EDIT_CUSTOMER,
        Permission.ARCHIVE_CUSTOMER,
        Permission.DELETE_CUSTOMER,
        Permission.DELETE_CUSTOMER_PERMANENTLY
      );
    }

    if (membership.role === "ADMIN") {
      newPermissions.push(
        Permission.CREATE_CUSTOMER,
        Permission.VIEW_CUSTOMERS,
        Permission.EDIT_CUSTOMER
      );
    }

    if (membership.role === "MANAGER") {
      newPermissions.push(
        Permission.CREATE_CUSTOMER,
        Permission.VIEW_CUSTOMERS
      );
    }

    await prisma.tenantMembership.update({
      where: { id: membership.id },
      data: { permissions: Array.from(new Set(newPermissions)) },
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

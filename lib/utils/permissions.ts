import { Permission, User } from "@prisma/client";

export function hasPermission(
  user: User & { memberships: { permissions: Permission[] }[] },
  permission: Permission
): boolean {
  const fromMemberships = user.memberships?.some((m) =>
    m.permissions.includes(permission)
  );

  const isSuperAdmin = user.role === "SUPER_ADMIN";

  return isSuperAdmin || fromMemberships;
}

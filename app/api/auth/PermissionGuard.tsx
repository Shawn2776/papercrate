"use client";

import { useHasPermission } from "@/lib/functions/userHasPermission";
import { Permission } from "@prisma/client";

type PermissionGuardProps = {
  required: Permission | Permission[];
  mode?: "all" | "any";
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const PermissionGuard = ({
  required,
  mode = "all",
  children,
  fallback = null,
}: PermissionGuardProps) => {
  const hasAccess = useHasPermission(required, mode);

  return <>{hasAccess ? children : fallback}</>;
};

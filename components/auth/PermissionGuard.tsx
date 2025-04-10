// components/auth/PermissionGuard.tsx
"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { Permission } from "@prisma/client";

type PermissionGuardProps = {
  children: React.ReactNode;
  required: Permission[];
  fallback?: React.ReactNode;
};

export const PermissionGuard = ({
  children,
  required,
  fallback = (
    <p className="text-center text-sm text-muted-foreground">
      You do not have permission to view this.
    </p>
  ),
}: PermissionGuardProps) => {
  const { permissions, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-muted-foreground text-sm">Loading permissions...</p>
      </div>
    );
  }

  const hasPermission = required.every((perm) => permissions.includes(perm));

  return hasPermission ? <>{children}</> : fallback;
};

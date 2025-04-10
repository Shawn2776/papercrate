import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Permission } from "@prisma/client";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <AuthInitializer />
      <PermissionGuard required={[Permission.VIEW_INVOICES]}>
        <div className="max-w-2xl mx-auto mt-2 px-2">{children}</div>
      </PermissionGuard>
    </>
  );
};

export default DashboardLayout;

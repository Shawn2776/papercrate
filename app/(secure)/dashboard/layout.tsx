import { AppSidebar } from "@/components/layout/AppSidebar";
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
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </PermissionGuard>
    </>
  );
};

export default DashboardLayout;

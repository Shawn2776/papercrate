"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Permission } from "@prisma/client";
import { Toaster } from "@/components/ui/sonner";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <AuthInitializer />
      <PermissionGuard required={[Permission.VIEW_INVOICES]}>
        <div className="flex min-h-screen">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed z-50 top-0 left-0 h-full bg-white shadow-md transform transition-transform duration-300 ease-in-out
            ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:static md:translate-x-0 md:block`}
          >
            <AppSidebar hideCollapseToggleOnMobile />
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-4 w-full">
            <div className="flex items-center justify-between mb-4 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <UserButton />
            </div>

            <div className="hidden md:flex justify-end mb-4">
              <UserButton />
            </div>

            {children}
            <Toaster richColors position="top-center" />
          </main>
        </div>
      </PermissionGuard>
    </>
  );
};

export default DashboardLayout;

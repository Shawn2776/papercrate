import { AppSidebar } from "@/components/layout/AppSidebar";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Permission } from "@prisma/client";
import { Toaster } from "@/components/ui/sonner";
import { UserButton } from "@clerk/nextjs";

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
          <main className="flex-1 overflow-auto p-4">
            <UserButton />
            {children}
            <Toaster richColors position="top-center" />
          </main>
        </div>
      </PermissionGuard>
    </>
  );
};

export default DashboardLayout;

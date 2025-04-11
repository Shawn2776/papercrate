import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Permission } from "@prisma/client";
import { usePathname } from "next/navigation";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const isOnboarding = pathname.startsWith("/dashboard/new-user");

  return (
    <>
      <AuthInitializer />
      {isOnboarding ? (
        // Skip permission guard and sidebar for onboarding
        <main className="min-h-screen">{children}</main>
      ) : (
        <PermissionGuard required={[Permission.VIEW_INVOICES]}>
          <div className="flex min-h-screen">
            <AppSidebar />
            <main className="flex-1 overflow-auto p-4">{children}</main>
          </div>
        </PermissionGuard>
      )}
    </>
  );
};

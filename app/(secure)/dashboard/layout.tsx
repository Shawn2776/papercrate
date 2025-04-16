import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getDbUserOrRedirect } from "@/lib/functions/getDbUserOrRedirect";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { headers } from "next/headers";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getDbUserOrRedirect();
  const memberships = await prisma.tenantMembership.findMany({
    where: { userId: user.id },
  });

  const hasTenant = memberships.length > 0;
  if (!hasTenant) redirect("/new-user/1");

  const pathname = (await headers()).get("x-pathname") ?? "/dashboard";
  const pathSegments = pathname.split("/").filter(Boolean).slice(1); // removes 'dashboard'

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <PageBreadcrumbs />
          <UserButton />
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 w-full">{children}</main>
        <Toaster richColors position="top-center" />
      </div>
    </div>
  );
}

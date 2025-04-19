import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { UserButton } from "@clerk/nextjs";

import { getDbUserOrRedirect } from "@/lib/auth/getDbUserOrRedirect";
import { requireTenant } from "@/lib/auth/requireTenant";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import { Toaster } from "@/components/ui/sonner";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getDbUserOrRedirect();
  await requireTenant(user.id); // 🔐 Ensures valid tenant or redirects

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop only) */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white">
        <AppSidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <div className="flex items-center gap-2">
            {/* Mobile Sidebar Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger className="p-2 rounded hover:bg-muted/50">
                  <Menu className="w-5 h-5" />
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <AppSidebar />
                </SheetContent>
              </Sheet>
            </div>

            {/* Breadcrumbs */}
            <PageBreadcrumbs />
          </div>

          {/* User menu */}
          <UserButton />
        </header>

        {/* Main */}
        <main className="flex-1 p-4 w-full">
          <AuthInitializer />
          {children}
        </main>

        {/* Notifications */}
        <Toaster richColors position="top-center" />
      </div>
    </div>
  );
}

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SecureLayout({ children }) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in"); // optional: guard for unauthenticated users
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id }, // 👈 Correct lookup
    select: { businessId: true },
  });

  if (!dbUser?.businessId) {
    redirect("/setup-business"); // optional: guard for users without a business
  }

  return (
    <ReduxProvider>
      <SidebarProvider>
        <AppSidebar variant={"secure"} />
        <SidebarInset>
          <SiteHeader />
          <main className="w-full">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ReduxProvider>
  );
}

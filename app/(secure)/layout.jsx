// app/(secure)/layout.jsx
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { prisma } from "@/lib/db";
import { fallbackCreateUser } from "@/lib/utils/fallbackCreateUser";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SecureLayout({ children }) {
  const user = await currentUser();

  // Not signed in
  if (!user) {
    return redirect("/sign-in");
  }

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { businessId: true },
  });

  if (!dbUser) {
    const createdUser = await fallbackCreateUser(user);
    dbUser = { businessId: createdUser.businessId };
  }

  // If the user is not in the DB yet or no business is linked
  if (!dbUser?.businessId) {
    return (
      <div className="p-4">
        <p>
          No business found.{" "}
          <a href="/setup-business">Click here to create one.</a>
        </p>
      </div>
    );
  }

  return (
    <ReduxProvider>
      <SidebarProvider>
        <AppSidebar variant="secure" />
        <SidebarInset>
          <SiteHeader />
          <main className="w-full">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ReduxProvider>
  );
}

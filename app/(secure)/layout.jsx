import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const SecureLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar variant={"secure"} />
      <SidebarInset>
        <SiteHeader />
        <main className="w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SecureLayout;

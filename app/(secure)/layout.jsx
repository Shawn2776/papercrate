import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const SecureLayout = ({ children }) => {
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
};

export default SecureLayout;

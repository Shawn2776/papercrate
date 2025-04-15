"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Banknote,
  Receipt,
  Cog,
  BookOpen,
  BarChart3,
} from "lucide-react";
import clsx from "clsx";

import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";
import { TenantSwitcherClient } from "./TenantSwitcherClient";
import { Permission } from "@prisma/client";

export function AppSidebar({
  hideCollapseToggleOnMobile = false,
}: {
  hideCollapseToggleOnMobile?: boolean;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const tenant = useAppSelector(selectCurrentTenant);
  const tenantName = tenant?.name || "Tenant";
  const permissions = useAppSelector((state) => state.auth.permissions);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
    { label: "Payments", href: "/dashboard/payments", icon: Banknote },
    { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { label: "Products", href: "/dashboard/products", icon: Package },
    { label: "Customers", href: "/dashboard/customers", icon: Users },
    { label: "Receipts", href: "/dashboard/receipts", icon: Receipt },
    { label: "Documentation", href: "/dashboard/docs", icon: BookOpen },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Cog,
      permission: Permission.MANAGE_BILLING,
    },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(collapsed));
  }, [collapsed]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const shouldShowCollapse = !isMobile || !hideCollapseToggleOnMobile;

  return (
    <aside
      className={clsx(
        "h-screen border-r bg-background text-muted-foreground transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex flex-col gap-1">
          {!collapsed && (
            <>
              <span className="text-lg font-bold leading-tight">
                PaperCrate
              </span>
              <TenantSwitcherClient />
            </>
          )}
          {collapsed && (
            <span className="text-sm font-bold tracking-tight">PC</span>
          )}
        </div>
        {shouldShowCollapse && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-xs"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1 p-2">
        {navItems.map(({ label, href, icon: Icon, permission }) => {
          if (permission && !permissions.includes(permission)) return null;

          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

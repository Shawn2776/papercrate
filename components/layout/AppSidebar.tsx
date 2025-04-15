"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  BarChart2,
  Package,
  Users,
  Receipt,
  BookOpen,
} from "lucide-react";
import { TenantSwitcher } from "./TenantSwitcher";
import path from "path";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/payments", label: "Payments", icon: DollarSign },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart2 },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/receipts", label: "Receipts", icon: Receipt },
  { href: "/dashboard/documentation", label: "Documentation", icon: BookOpen },
];

const getFinalSegment = (str: string) => {
  if (!str) return;

  const parts = str.split("/");
  const lastPart = parts.pop();

  if (!lastPart) return;

  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
};

export function AppSidebar() {
  const pathname = usePathname();
  const finalSegment = getFinalSegment(pathname);

  return (
    <aside className="hidden md:flex flex-col w-64 border-r min-h-screen bg-white">
      {/* Branding / Tenant */}
      <div className="px-6 py-4 border-b">
        <div className="text-lg font-bold">PaperCrate</div>
        <div className="w-fit">
          <TenantSwitcher />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {pathname && <>{console.log(finalSegment)}</>}

        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium hover:bg-muted hover:text-primary",
                isActive && "bg-muted text-primary"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

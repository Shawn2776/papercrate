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
import { SidebarLink } from "./SidebarLink";

import { navItems } from "@/lib/constants/nav";

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
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <SidebarLink key={href} href={href} icon={Icon} label={label} />
          );
        })}
      </nav>
    </aside>
  );
}

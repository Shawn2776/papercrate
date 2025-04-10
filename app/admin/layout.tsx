// app/admin/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import {
  Settings2,
  Users,
  LayoutDashboard,
  Building2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Tenants", href: "/admin/tenants", icon: Building2 },
  { label: "Invoices", href: "/admin/invoices", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings2 },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <div className="min-h-screen flex bg-background text-foreground">
        {/* Sidebar */}
        <aside className="w-64 border-r p-4 space-y-6 hidden md:block bg-muted">
          <div className="text-2xl font-bold tracking-tight">
            PaperCrate Admin
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ClerkProvider>
  );
}

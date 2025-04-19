// components/layout/SidebarLink.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function SidebarLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  const pathname = usePathname();
  const basePath = pathname.split("/").slice(0, 3).join("/"); // e.g. /dashboard/invoices

  const isActive = basePath === href;

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-md transition",
        isActive
          ? "bg-muted text-primary font-semibold"
          : "text-muted-foreground hover:bg-muted/50"
      )}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
}

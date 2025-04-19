"use client";

import { flexRender, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { InvoiceRow } from "./columns";

interface InvoiceTableRowProps {
  row: Row<InvoiceRow>;
}

export function InvoiceTableRow({ row }: InvoiceTableRowProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    const clickedInMobile = (e.target as HTMLElement)?.closest(
      "[data-mobile-summary]"
    );
    if (clickedInMobile) return;

    const invoiceId = row.original.id;
    if (invoiceId) {
      router.push(`/dashboard/invoices/${invoiceId}`);
    }
  };

  return (
    <TableRow
      onClick={handleClick}
      className="cursor-pointer hover:bg-muted/40 m-1 p-1"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(cell.column.columnDef.meta?.className)}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

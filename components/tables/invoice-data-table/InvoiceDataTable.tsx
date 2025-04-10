"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { rankItem } from "@tanstack/match-sorter-utils";
import Link from "next/link";
import { getInvoiceColumns, InvoiceRow } from "./columns";
import { cn } from "@/lib/utils";
import { Permission } from "@prisma/client";

type InvoiceDataTableProps = {
  data: InvoiceRow[];
  userPermissions: Permission[];
};

const globalFilterFn = (
  row: Row<InvoiceRow>,
  columnId: string,
  filterValue: string
): boolean => {
  const itemRank = rankItem(row.getValue(columnId), filterValue);
  return itemRank.passed;
};

export function InvoiceDataTable({
  data,
  userPermissions,
}: InvoiceDataTableProps) {
  const [filter, setFilter] = React.useState("");
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);

  const handleEdit = (id: string) => {
    alert(`Edit invoice ${id}`);
  };

  const handleDelete = (id: string) => {
    alert(`Delete invoice ${id}`);
  };

  const columns = React.useMemo(
    () =>
      getInvoiceColumns({
        expandedRowId,
        setExpandedRowId,
        userPermissions,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [expandedRowId, userPermissions]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter: filter },
    onGlobalFilterChange: setFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Link href="/dashboard/invoices/new">
          <Button className="shadow-md rounded-none">New Invoice</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      "cursor-pointer select-none",
                      header.column.columnDef.meta?.className
                    )}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() &&
                      {
                        asc: " 🔼",
                        desc: " 🔽",
                        false: " ⬍",
                      }[(header.column.getIsSorted() as string) || "false"]}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={(e) => {
                    const clickedInMobile = (e.target as HTMLElement)?.closest(
                      "[data-mobile-summary]"
                    );
                    if (clickedInMobile) return;

                    window.location.href = `/dashboard/invoices/${row.original.id}`;
                  }}
                  className="cursor-pointer hover:bg-muted/40 m-1 p-1"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(cell.column.columnDef.meta?.className)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

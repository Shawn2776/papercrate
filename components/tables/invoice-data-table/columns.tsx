import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as SwipeListType,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

import { Permission } from "@prisma/client";
import { InvoiceMobileRow } from "./InvoiceMobileRow";

export interface InvoiceRow {
  id: string;
  number: string;
  status: string;
  amount: string;
  customer: string;
  createdAt: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "text-green-600 border-green-600";
    case "overdue":
      return "text-red-600 border-red-600";
    case "pending":
      return "text-yellow-600 border-yellow-600";
    default:
      return "text-blue-600 border-blue-600";
  }
};

export const getInvoiceColumns = ({
  expandedRowId,
  setExpandedRowId,
  userPermissions,
  onEdit,
  onDelete,
}: {
  expandedRowId: string | null;
  setExpandedRowId: (id: string | null) => void;
  userPermissions: Permission[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}): ColumnDef<InvoiceRow>[] => [
  {
    id: "summary",
    header: () => null,
    enableSorting: false,
    enableHiding: false,
    meta: { className: "sm:hidden" },
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <div className="w-full sm:hidden">
          <InvoiceMobileRow
            id={invoice.id}
            status={invoice.status}
            amount={invoice.amount}
            customer={invoice.customer}
            userPermissions={userPermissions}
            onEdit={onEdit}
            onDelete={onDelete}
            expanded={row.id === expandedRowId}
            toggleExpand={() =>
              setExpandedRowId(row.id === expandedRowId ? null : row.id)
            }
          />
        </div>
      );
    },
  },
  {
    accessorKey: "number",
    header: "Invoice #",
    meta: { className: "hidden sm:table-cell" },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`capitalize px-2 py-0.5 border ${getStatusColor(
          row.original.status
        )}`}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: { className: "hidden sm:table-cell text-right" },
    accessorFn: (row) => parseFloat(row.amount.replace(/[^0-9.-]+/g, "")),
    cell: ({ row }) => row.original.amount,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    meta: { className: "hidden sm:table-cell" },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    meta: { className: "hidden sm:table-cell" },
    accessorFn: (row) => new Date(row.createdAt),
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
  },
  {
    id: "actions",
    header: "Actions",
    meta: { className: "hidden sm:table-cell text-right" },
    cell: ({ row }) => {
      const canEdit = userPermissions.includes(Permission.EDIT_INVOICE);
      const canDelete = userPermissions.includes(Permission.DELETE_INVOICE);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/invoices/${row.original.id}`}>View</Link>
            </DropdownMenuItem>
            {canEdit && (
              <DropdownMenuItem onClick={() => onEdit(row.original.id)}>
                Edit
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this invoice?")
                  ) {
                    onDelete(row.original.id);
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

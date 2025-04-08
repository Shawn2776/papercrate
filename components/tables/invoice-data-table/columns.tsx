import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

// ✅ Define invoice row shape
export interface InvoiceRow {
  id: string;
  number: string;
  status: string;
  amount: string; // e.g. "$123.45"
  customer: string;
  createdAt: string; // ISO or displayable string
}

export const columns: ColumnDef<InvoiceRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    header: "Invoice #",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`capitalize ${
          row.original.status === "Paid"
            ? "text-green-600"
            : row.original.status === "Overdue"
            ? "text-red-600"
            : row.original.status === "Pending"
            ? "text-blue-600"
            : "text-yellow-600"
        }`}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableSorting: true,
    accessorFn: (row) => parseFloat(row.amount.replace(/[^0-9.-]+/g, "")),
    cell: ({ row }) => row.original.amount,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    accessorFn: (row) => new Date(row.createdAt),
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
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
          <DropdownMenuItem onClick={() => alert(`Edit ${row.original.id}`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert(`Delete ${row.original.id}`)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

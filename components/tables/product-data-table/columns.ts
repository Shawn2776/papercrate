import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/functions/formatCurrency";

type Product = {
  name: string;
  sku?: string;
  barcode?: string;
  price?: number;
  createdAt?: string | Date;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product",
  },
  {
    accessorKey: "sku",
    header: "SKU",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => row.original.sku || "N/A",
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => row.original.barcode || "N/A",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) =>
      typeof row.original.price === "number"
        ? formatCurrency(row.original.price)
        : "—",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) =>
      row.original.createdAt
        ? format(new Date(row.original.createdAt), "yyyy-MM-dd hh:mm a")
        : "—",
  },
];

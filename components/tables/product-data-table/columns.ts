// Updated Product table columns without date-fns
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils/formatCurrency";

const formatDate = (value?: string | Date) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(value))
    : "—";

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
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];

import { formatCurrency } from "@/lib/formatCurrency";
import { format } from "date-fns";

export const columns = [
  {
    accessorKey: "name",
    header: "Product",
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: (row) => row?.sku || "N/A",
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
    cell: (row) => row?.barcode || "N/A",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (row) =>
      typeof row?.price === "number" ? formatCurrency(row.price) : "—",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: (row) =>
      row?.createdAt
        ? format(new Date(row.createdAt), "yyyy-MM-dd hh:mm a")
        : "—",
  },
];

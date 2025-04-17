"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Permission } from "@prisma/client"; // adjust if you're using a local enum instead

type Product = {
  name: string;
  sku?: string;
  barcode?: string;
  price?: number;
  createdAt?: string | Date;
};

type ProductDataTableProps = {
  columns: ColumnDef<Product>[];
  data: Product[];
  userPermissions?: Permission[]; // or your own custom permission type
};

export function ProductDataTable({
  columns,
  data,
  userPermissions,
}: ProductDataTableProps) {
  return <DataTable columns={columns} data={data} />;
}

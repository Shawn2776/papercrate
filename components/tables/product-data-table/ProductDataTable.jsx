"use client";

import { DataTable } from "@/components/ui/data-table";

export function ProductDataTable({ columns, data }) {
  return <DataTable columns={columns} data={data} />;
}

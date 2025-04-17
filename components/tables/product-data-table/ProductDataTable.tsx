"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Permission } from "@prisma/client";
import type { Product as PrismaProduct } from "@/lib/redux/slices/productsSlice"; // ✅ CORRECT

type Product = Pick<
  PrismaProduct,
  "id" | "name" | "price" | "sku" | "barcode" | "createdAt"
>;

type ProductDataTableProps = {
  data: Product[];
  userPermissions?: Permission[];
};

export function ProductDataTable({
  data,
  userPermissions = [],
}: ProductDataTableProps) {
  const [search, setSearch] = useState("");

  const canEdit = userPermissions.includes("EDIT_PRODUCT");
  const canDelete = userPermissions.includes("DELETE_PRODUCT");

  const filteredData = useMemo(() => {
    return data.filter((product) =>
      `${product.name} ${product.sku ?? ""} ${product.barcode ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, data]);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "sku",
      header: "SKU",
    },
    {
      accessorKey: "barcode",
      header: "Barcode",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) =>
        typeof row.original.price === "number"
          ? `$${Number(row.original.price).toFixed(2)}`
          : "—",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "—",
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const product = row.original;

        if (!canEdit && !canDelete) return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem
                  onClick={() => alert(`Edit product ${product.name}`)}
                >
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  onClick={() => alert(`Delete product ${product.name}`)}
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by name, SKU, barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}

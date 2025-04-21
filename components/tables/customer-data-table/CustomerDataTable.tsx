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
import { NormalizedCustomer } from "@/lib/types";

// Date formatting fallback
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

type Customer = Pick<
  NormalizedCustomer,
  "id" | "name" | "email" | "phone" | "billingCity" | "createdAt"
>;

type CustomerDataTableProps = {
  data: Customer[];
  userPermissions?: Permission[];
};

export function CustomerDataTable({
  data,
  userPermissions = [],
}: CustomerDataTableProps) {
  const [search, setSearch] = useState("");

  const canEdit = userPermissions.includes("EDIT_CUSTOMER");
  const canDelete = userPermissions.includes("DELETE_CUSTOMER");

  const filteredData = useMemo(() => {
    return data.filter((customer) =>
      `${customer.name} ${customer.email} ${customer.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, data]);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "billingCity",
      header: "City",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const customer = row.original;

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
                  onClick={() => alert(`Edit customer ${customer.name}`)}
                >
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  onClick={() => alert(`Delete customer ${customer.name}`)}
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
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}

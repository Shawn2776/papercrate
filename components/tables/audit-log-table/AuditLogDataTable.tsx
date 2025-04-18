"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { AuditLog, User } from "@prisma/client";

type AuditLogWithUser = AuditLog & {
  user: Pick<User, "name" | "email">;
};

type Props = {
  data: AuditLogWithUser[];
};

export function AuditLogDataTable({ data }: Props) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((log) =>
      `${log.user.name ?? ""} ${log.user.email} ${log.entityType} ${log.action}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, data]);

  const columns: ColumnDef<AuditLogWithUser>[] = [
    {
      accessorKey: "performedAt",
      header: "Date",
      cell: ({ row }) => new Date(row.original.performedAt).toLocaleString(),
    },
    {
      accessorKey: "user.email",
      header: "User",
      cell: ({ row }) =>
        `${row.original.user.name ?? ""} (${row.original.user.email})`,
    },
    {
      accessorKey: "action",
      header: "Action",
    },
    {
      accessorKey: "entityType",
      header: "Entity",
    },
    {
      accessorKey: "entityId",
      header: "Entity ID",
    },
  ];

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search logs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}

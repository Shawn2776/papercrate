"use client";

import { useState, useMemo, useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AuditLog, User } from "@prisma/client";
import { DataTable } from "@/components/ui/data-table";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterBar } from "../filterBar";
import { Button } from "@/components/ui/button";

type AuditLogWithUser = AuditLog & {
  user: Pick<User, "name" | "email">;
};

type Props = {
  data: AuditLogWithUser[];
};

export function AuditLogDataTable({ data }: Props) {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [user, setUser] = useState("");
  const [field, setField] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const allActions = [...new Set(data.map((log) => log.action))].sort();
  const allEntities = [...new Set(data.map((log) => log.entityType))].sort();
  const allUsers = [...new Set(data.map((log) => log.user.email))].sort();
  const allFields = [
    ...new Set(
      data.flatMap((log) =>
        log.diff ? Object.keys(log.diff as Record<string, unknown>) : []
      )
    ),
  ].sort();

  const filteredData = useMemo(() => {
    return data.filter((log) => {
      const matchesSearch = `${log.user.name ?? ""} ${log.user.email} ${
        log.entityType
      } ${log.action}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesAction = !action || log.action === action;
      const matchesEntity = !entity || log.entityType === entity;
      const matchesUser = !user || log.user.email === user;
      const matchesField =
        !field ||
        (log.diff &&
          Object.keys(log.diff as Record<string, unknown>).includes(field));

      return (
        matchesSearch &&
        matchesAction &&
        matchesEntity &&
        matchesUser &&
        matchesField
      );
    });
  }, [search, action, entity, user, field, data]);

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
      id: "expand",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const id = row.original.id;
        const expanded = expandedId === id;

        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedId(expanded ? null : id)}
          >
            <ArrowDown
              className={cn("h-4 w-4 transition-transform", {
                "rotate-180": expanded,
              })}
            />
          </Button>
        );
      },
    },
  ];

  const handlePrint = () => {
    if (!printRef.current) return;
    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <html>
        <head><title>Print Audit Logs</title></head>
        <body>${printRef.current.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        action={action}
        onActionChange={setAction}
        entity={entity}
        onEntityChange={setEntity}
        user={user}
        onUserChange={setUser}
        field={field}
        onFieldChange={setField}
        actions={allActions}
        entities={allEntities}
        users={allUsers}
        fields={allFields}
        onReset={() => {
          setSearch("");
          setAction("");
          setEntity("");
          setUser("");
          setField("");
        }}
        onExport={(type) => {
          if (type === "json") {
            const blob = new Blob([JSON.stringify(filteredData, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "audit-logs.json";
            link.click();
            URL.revokeObjectURL(url);
          } else {
            const header = Object.keys(filteredData[0] || {}).join(",");
            const rows = filteredData.map((log) =>
              Object.values(log)
                .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                .join(",")
            );
            const csv = [header, ...rows].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "audit-logs.csv";
            link.click();
            URL.revokeObjectURL(url);
          }
        }}
        onSave={(type) => {
          if (type === "print") handlePrint();
        }}
      />

      <div ref={printRef}>
        <DataTable columns={columns} data={filteredData} />
      </div>

      {expandedId &&
        (() => {
          const selected = data.find((log) => log.id === expandedId);
          if (!selected) return null;

          return (
            <div className="bg-muted p-4 rounded-md space-y-4 text-sm overflow-x-auto">
              <h4 className="font-bold text-base">Audit Details</h4>

              {selected.diff && (
                <div>
                  <strong>Changed Fields:</strong>
                  <ul className="pl-4 list-disc space-y-1 mt-2">
                    {Object.entries(
                      selected.diff as Record<
                        string,
                        { from: unknown; to: unknown }
                      >
                    ).map(([key, { from, to }]) => (
                      <li key={key}>
                        <code className="font-mono text-xs">{key}</code>:{" "}
                        <span className="text-sm">
                          <span className="text-red-600 line-through">
                            {JSON.stringify(from)}
                          </span>{" "}
                          →{" "}
                          <span className="text-green-600 font-semibold ml-1">
                            {JSON.stringify(to)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <strong>Before:</strong>
                <pre className="mt-1 bg-background p-2 rounded border text-xs whitespace-pre-wrap">
                  {JSON.stringify(selected.before, null, 2)}
                </pre>
              </div>
              <div>
                <strong>After:</strong>
                <pre className="mt-1 bg-background p-2 rounded border text-xs whitespace-pre-wrap">
                  {JSON.stringify(selected.after, null, 2)}
                </pre>
              </div>
            </div>
          );
        })()}
    </div>
  );
}

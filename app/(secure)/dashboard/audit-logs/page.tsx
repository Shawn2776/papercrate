"use client";

import { useEffect, useState } from "react";
import { AuditLog, User, Permission } from "@prisma/client";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AuditLogDataTable } from "@/components/tables/audit-log-table/AuditLogDataTable";

type AuditLogWithUser = AuditLog & {
  user: Pick<User, "name" | "email" | "id">;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogWithUser[]>([]);
  const [users, setUsers] = useState<Pick<User, "id" | "name">[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [action, setAction] = useState<string | undefined>();
  const [entityType, setEntityType] = useState<string | undefined>();
  const [userId, setUserId] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    const params = new URLSearchParams();
    if (action) params.set("action", action);
    if (entityType) params.set("entityType", entityType);
    if (userId) params.set("userId", userId);

    try {
      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load audit logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setError("Could not load audit logs.");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [action, entityType, userId]);

  useEffect(() => {
    // preload list of users for filter dropdown
    fetch("/api/users/simple")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  const resetFilters = () => {
    setAction(undefined);
    setEntityType(undefined);
    setUserId(undefined);
    setSearch("");
  };

  return (
    <PermissionGuard required={[Permission.VIEW_AUDIT_LOGS]}>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        {error && <p className="text-destructive text-sm">{error}</p>}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end">
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <Select onValueChange={setAction} value={action}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CREATE">CREATE</SelectItem>
              <SelectItem value="UPDATE">UPDATE</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setEntityType} value={entityType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Invoice">Invoice</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
              {/* Add more as needed */}
            </SelectContent>
          </Select>

          <Select onValueChange={setUserId} value={userId}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>

        <AuditLogDataTable data={logs} />
      </div>
    </PermissionGuard>
  );
}

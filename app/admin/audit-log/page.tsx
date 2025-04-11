"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  user: { name: string | null; email: string };
  performedAt: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [actionFilter, setActionFilter] = useState<string>("");
  const [entityFilter, setEntityFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/audit-log")
      .then((res) => res.json())
      .then((data: AuditEntry[]) => {
        const sorted = data.sort((a, b) =>
          sortAsc
            ? new Date(a.performedAt).getTime() -
              new Date(b.performedAt).getTime()
            : new Date(b.performedAt).getTime() -
              new Date(a.performedAt).getTime()
        );
        setLogs(sorted);
      })
      .finally(() => setLoading(false));
  }, [sortAsc]);

  function downloadCSV(data: AuditEntry[]) {
    const headers = [
      "ID",
      "Action",
      "Entity Type",
      "Entity ID",
      "User Name",
      "User Email",
      "Performed At",
      "Before (JSON)",
      "After (JSON)",
    ];

    const rows = data.map((log) => [
      log.id,
      log.action,
      log.entityType,
      log.entityId,
      log.user.name ?? "",
      log.user.email,
      new Date(log.performedAt).toISOString(),
      JSON.stringify(log.before ?? {}, null, 2),
      JSON.stringify(log.after ?? {}, null, 2),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((field) => {
            const safe =
              typeof field === "string" ? field.replace(/"/g, '""') : field;
            return `"${safe}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "audit-log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.performedAt).getTime();
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesEntity =
      entityFilter === "all" || log.entityType === entityFilter;
    const matchesSearch =
      log.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStart = startDate
      ? logDate >= new Date(startDate).getTime()
      : true;
    const matchesEnd = endDate ? logDate <= new Date(endDate).getTime() : true;

    return (
      matchesAction &&
      matchesEntity &&
      matchesSearch &&
      matchesStart &&
      matchesEnd
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Audit Log</h2>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSortAsc((prev) => !prev)}>
            {sortAsc ? (
              <ArrowUp className="w-4 h-4 mr-2" />
            ) : (
              <ArrowDown className="w-4 h-4 mr-2" />
            )}
            Sort by Date
          </Button>
          <Button variant="secondary" onClick={() => downloadCSV(filteredLogs)}>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <Select onValueChange={(v) => setActionFilter(v)} value={actionFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="CREATE">CREATE</SelectItem>
            <SelectItem value="UPDATE">UPDATE</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(v) => setEntityFilter(v)} value={entityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Entity Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Tenant">Tenant</SelectItem>
            <SelectItem value="Product">Product</SelectItem>
            <SelectItem value="Invoice">Invoice</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by user/email"
          className="w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-[160px]"
          placeholder="Start date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-[160px]"
          placeholder="End date"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          {loading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <>
                    <TableRow key={log.id}>
                      <TableCell>
                        {new Date(log.performedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        {log.entityType}{" "}
                        <span className="text-xs text-muted-foreground">
                          ({log.entityId})
                        </span>
                      </TableCell>
                      <TableCell>{log.user.name ?? log.user.email}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setExpandedId((prev) =>
                              prev === log.id ? null : log.id
                            )
                          }
                        >
                          {expandedId === log.id ? "Hide" : "View"}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedId === log.id && (
                      <TableRow key={`${log.id}-details`}>
                        <TableCell colSpan={5}>
                          <pre className="bg-muted rounded-md p-4 text-xs overflow-x-auto">
                            <strong className="text-primary">Before:</strong>
                            {"\n"}
                            {JSON.stringify(log.before, null, 2)}
                            {"\n\n"}
                            <strong className="text-primary">After:</strong>
                            {"\n"}
                            {JSON.stringify(log.after, null, 2)}
                          </pre>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// app/admin/users/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import PermissionSelector from "@/components/admin/PermissionSelector";

interface LinkedRecord {
  id: string;
  description?: string;
  createdAt?: string;
}

interface UserDetail {
  id: string;
  email: string;
  name?: string;
  role: string;
  deleted: boolean;
  createdAt: string;
  memberships: {
    tenant: {
      id: string;
      name: string;
    };
    role: string;
    permissions: string[];
  }[];
  counts: Record<string, number>;
  createdInvoices: LinkedRecord[];
  updatedInvoices: LinkedRecord[];
  createdProducts: LinkedRecord[];
  updatedProducts: LinkedRecord[];
  auditLogs: LinkedRecord[];
}

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((res) => res.json())
      .then(setUser)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch("/api/enums/roles")
      .then((res) => res.json())
      .then(setAvailableRoles)
      .catch((err) => console.error("Failed to fetch roles:", err));
  }, []);

  if (loading || !user) return <Skeleton className="h-20 w-full" />;

  const renderLinkedRecords = (label: string, records: LinkedRecord[]) => (
    <Collapsible defaultOpen>
      <CollapsibleTrigger asChild>
        <Card>
          <CardHeader>
            <CardTitle>{label}</CardTitle>
          </CardHeader>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent className="space-y-2 text-sm">
          {records.length === 0 ? (
            <p className="text-muted-foreground">No records found.</p>
          ) : (
            <div className="border rounded">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-3 py-2">ID</th>
                    <th className="text-left px-3 py-2">Created</th>
                    <th className="text-right px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec.id} className="border-t">
                      <td className="px-3 py-2">{rec.id}</td>
                      <td className="px-3 py-2">
                        {rec.createdAt
                          ? new Date(rec.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="ml-2"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="text-muted-foreground">Full profile and linked data</p>
        </div>
        <div className="space-x-2">
          {editMode && (
            <Button
              variant="secondary"
              onClick={() => {
                // handleSave(user) // optionally trigger a save
                setEditMode(false);
              }}
            >
              Save
            </Button>
          )}
          <Button
            variant={editMode ? "outline" : "default"}
            onClick={() => setEditMode((prev) => !prev)}
          >
            {editMode ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <div className="border-b px-4 py-3 bg-white">
            <h2 className="text-base font-semibold tracking-tight">Summary</h2>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border px-6 py-6 bg-white grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5 text-sm">
            <div>
              <label className="block mb-1 text-xs font-semibold uppercase">
                Email
              </label>
              <Input
                value={user.email}
                disabled={!editMode}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold uppercase">
                Name
              </label>
              <Input
                value={user.name ?? ""}
                disabled={!editMode}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold uppercase">
                Role
              </label>
              <select
                value={user.role}
                disabled={!editMode}
                className="w-full px-3 py-2 border rounded text-sm"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold uppercase">
                Status
              </label>
              <select
                value={user.deleted ? "Deleted" : "Active"}
                disabled={!editMode}
                className="w-full px-3 py-2 border rounded text-sm"
              >
                <option value="Active">Active</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold uppercase">
                Created At
              </label>
              <p className="text-foreground font-medium">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <Card>
            <CardHeader>
              <CardTitle>Memberships</CardTitle>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-3">
            {user.memberships.map((m, i) => (
              <div
                key={m.tenant.id + i}
                className="border rounded p-3 text-sm bg-muted/30"
              >
                <p>
                  <strong>Tenant:</strong> {m.tenant.name} ({m.tenant.id})
                </p>
                <p>
                  <strong>Role:</strong> <Badge>{m.role}</Badge>
                </p>
                {editMode ? (
                  <PermissionSelector
                    selected={m.permissions}
                    onChange={(updated) => {
                      setUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              memberships: prev.memberships.map((mem, j) =>
                                j === i ? { ...mem, permissions: updated } : mem
                              ),
                            }
                          : null
                      );
                    }}
                  />
                ) : (
                  <p className="text-xs">
                    <strong>Permissions:</strong>{" "}
                    {m.permissions.join(", ") || "-"}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      {renderLinkedRecords("Created Invoices", user.createdInvoices)}
      {renderLinkedRecords("Updated Invoices", user.updatedInvoices)}
      {renderLinkedRecords("Created Products", user.createdProducts)}
      {renderLinkedRecords("Updated Products", user.updatedProducts)}
      {renderLinkedRecords("Audit Logs", user.auditLogs)}
    </div>
  );
}

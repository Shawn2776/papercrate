"use client";

import { useEffect, useState } from "react";
import { Tenant } from "@prisma/client";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function ShowDeletedToggle({
  showDeleted,
  setShowDeleted,
}: {
  showDeleted: boolean;
  setShowDeleted: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch
        id="show-deleted"
        checked={showDeleted}
        onCheckedChange={setShowDeleted}
      />
      <Label htmlFor="show-deleted">Show Deleted</Label>
    </div>
  );
}

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false); // 👈 Add toggle state

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/tenants?deleted=${showDeleted}`) // 👈 Use query param
      .then((res) => res.json())
      .then((data) => setTenants(data))
      .finally(() => setLoading(false));
  }, [showDeleted]); // 👈 Refetch when toggled

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">All Tenants</h2>

      <ShowDeletedToggle
        showDeleted={showDeleted}
        setShowDeleted={setShowDeleted}
      />

      <Card>
        <CardContent className="p-4">
          {loading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>{tenant.id}</TableCell>
                    <TableCell>{tenant.name}</TableCell>
                    <TableCell>{tenant.plan}</TableCell>
                    <TableCell>
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash className="w-4 h-4 text-destructive" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete this tenant?</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              This will remove the tenant and all related data.
                            </p>
                            <Button
                              variant="destructive"
                              onClick={async () => {
                                await fetch(`/api/admin/tenants/${tenant.id}`, {
                                  method: "DELETE",
                                });
                                setTenants((prev) =>
                                  prev.filter((t) => t.id !== tenant.id)
                                );
                              }}
                            >
                              Confirm Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

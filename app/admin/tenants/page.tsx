"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchAdminTenants,
  selectAdminTenants,
  setFilter,
} from "@/lib/redux/slices/adminTenantsSlice";
import { Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function ShowDeletedToggle({
  showDeleted,
  onToggle,
}: {
  showDeleted: boolean;
  onToggle: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch
        id="show-deleted"
        checked={showDeleted}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="show-deleted">Show Deleted</Label>
    </div>
  );
}

export default function AdminTenantsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { tenants, loading, filter } = useSelector(selectAdminTenants);

  useEffect(() => {
    dispatch(fetchAdminTenants());
  }, [dispatch, filter]);

  const handleDelete = async (tenantId: string) => {
    await fetch(`/api/admin/tenants/${tenantId}`, {
      method: "DELETE",
    });
    dispatch(fetchAdminTenants()); // Refresh after delete
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">All Tenants</h2>

      <ShowDeletedToggle
        showDeleted={filter === "deleted"}
        onToggle={(val) => dispatch(setFilter(val ? "deleted" : "active"))}
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
                              onClick={() => handleDelete(tenant.id)}
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

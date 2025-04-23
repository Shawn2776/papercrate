import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/lib/redux/store";
import {
  AdminTenant,
  setSelectedTenant,
  fetchTenantDetails,
  selectSelectedTenant,
} from "@/lib/redux/slices/adminTenantsSlice";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";

export function TenantTable({
  tenants,
  loading,
}: {
  tenants: AdminTenant[];
  loading: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const selectedTenant = useSelector(selectSelectedTenant);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <span className="text-muted-foreground">Loading tenants...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableCaption className="sr-only">A list of your tenants.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] text-center">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead className="text-center">Created</TableHead>
            <TableHead className="text-center w-[100px]">Status</TableHead>
            <TableHead className="text-right w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow
              key={tenant.id}
              className={selectedTenant?.id === tenant.id ? "bg-muted" : ""}
            >
              <TableCell className="flex justify-center items-center mt-1">
                <button
                  onClick={() => navigator.clipboard.writeText(tenant.id)}
                  title="Copy Tenant ID"
                  className="hover:text-primary transition-colors"
                >
                  <Clipboard
                    className="text-gray-500"
                    size={15}
                    onClick={() => {
                      navigator.clipboard.writeText(tenant.id);
                      alert("Tenant ID copied to clipboard.");
                    }}
                  />
                </button>
              </TableCell>
              <TableCell>{tenant.name}</TableCell>
              <TableCell>{tenant.plan}</TableCell>
              <TableCell className="text-center">
                {new Date(tenant.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  className={`w-full ${
                    tenant.deleted
                      ? "bg-red-700 text-white"
                      : "bg-green-700 text-white"
                  }`}
                >
                  {tenant.deleted ? "Deleted" : "Active"}
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  className="rounded-none"
                  onClick={() => {
                    dispatch(setSelectedTenant(tenant));
                    dispatch(fetchTenantDetails(tenant.id));
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total Tenants</TableCell>
            <TableCell className="text-right">{tenants.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchTenants,
  setCurrentTenant,
  selectAllTenants,
  selectCurrentTenant,
  selectTenantsLoading,
} from "@/lib/redux/slices/tenantSlice";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export const TenantSwitcherClient = () => {
  const dispatch = useAppDispatch();
  const tenants = useAppSelector(selectAllTenants);
  const currentTenant = useAppSelector(selectCurrentTenant);
  const loading = useAppSelector(selectTenantsLoading);

  useEffect(() => {
    dispatch(fetchTenants());
  }, [dispatch]);

  const handleSwitch = (value: string) => {
    if (value === "__create__") {
      // Redirect to create tenant page or open modal
      window.location.href = "/dashboard/new-user/1"; // Or your actual onboarding route
      return;
    }
    const selected = tenants.find((t) => t.id === value);
    if (selected) {
      dispatch(setCurrentTenant(selected));
      localStorage.setItem("activeTenantId", selected.id);
    }
  };

  if (loading) {
    return (
      <span className="text-xs text-muted-foreground italic">
        Loading tenants...
      </span>
    );
  }

  if (!tenants.length) {
    return (
      <span className="text-xs text-destructive font-medium">
        No tenants found
      </span>
    );
  }

  return (
    <Select onValueChange={handleSwitch} value={currentTenant?.id}>
      <SelectTrigger className="w-full text-xs h-8 px-2">
        <SelectValue placeholder="Select Tenant" />
      </SelectTrigger>
      <SelectContent>
        {tenants.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.name}
          </SelectItem>
        ))}

        <div className="border-t border-border my-1" />

        <SelectItem value="__create__" className="text-primary">
          ➕ Create New Tenant
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

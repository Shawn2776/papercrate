"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchTenants,
  setCurrentTenant,
  selectAllTenants,
  selectCurrentTenant,
  selectTenantsLoading,
} from "@/lib/redux/slices/tenantSlice";
import {
  resetCustomers,
  fetchCustomers,
} from "@/lib/redux/slices/customersSlice";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export const TenantSwitcher = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const tenants = useAppSelector(selectAllTenants);
  const currentTenant = useAppSelector(selectCurrentTenant);
  const loading = useAppSelector(selectTenantsLoading);

  useEffect(() => {
    dispatch(fetchTenants());
  }, [dispatch]);

  const handleSwitch = (value: string) => {
    if (value === "__create__") {
      const currentPlan = currentTenant?.plan ?? "FREE";
      const isLimited = currentPlan === "FREE" || currentPlan === "BASIC";
      const alreadyHasOne = tenants.length >= 1;

      if (isLimited && alreadyHasOne) {
        toast.error("Your plan doesn't allow multiple tenants.", {
          action: {
            label: "Upgrade Plan",
            onClick: () => router.push("/dashboard/settings/billing"),
          },
        });
        return;
      }

      router.push("/dashboard/new-user/1");
      return;
    }

    const selected = tenants.find((t) => t.id === value);
    if (selected) {
      dispatch(setCurrentTenant(selected));
      localStorage.setItem("activeTenantId", selected.id);

      // 🧹 Reset old customer data and fetch new
      dispatch(resetCustomers());
      dispatch(fetchCustomers());
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

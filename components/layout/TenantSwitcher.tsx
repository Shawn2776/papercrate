"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchTenants,
  setCurrentTenant,
  selectAllTenants,
  selectCurrentTenant,
} from "@/lib/redux/slices/tenantSlice";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export const TenantSwitcher = () => {
  const dispatch = useAppDispatch();
  const tenants = useAppSelector(selectAllTenants);
  const currentTenant = useAppSelector(selectCurrentTenant);

  useEffect(() => {
    dispatch(fetchTenants()); // this loads and sets tenants via Redux
  }, [dispatch]);

  const handleSwitch = (value: string) => {
    const selected = tenants.find((t) => t.id === value);
    if (selected) {
      dispatch(setCurrentTenant(selected));
      localStorage.setItem("activeTenantId", selected.id);
    }
  };

  if (!tenants.length) return null;

  return (
    <Select onValueChange={handleSwitch} value={currentTenant?.id}>
      <SelectTrigger className="w-full text-sm">
        <SelectValue placeholder="Select Tenant" />
      </SelectTrigger>
      <SelectContent>
        {tenants.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

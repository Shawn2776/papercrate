"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminTenants,
  selectAdminTenants,
  selectSelectedTenant,
} from "@/lib/redux/slices/adminTenantsSlice";
import { AppDispatch } from "@/lib/redux/store"; // make sure this exists
import { TenantTable } from "@/components/tables/tenant-table/TenantTable";
import { TenantDetailCard } from "@/components/tables/tenant-table/TenantDetailCard";

export default function AdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { tenants, loading } = useSelector(selectAdminTenants);
  const selectedTenant = useSelector(selectSelectedTenant);

  useEffect(() => {
    dispatch(fetchAdminTenants());
  }, [dispatch]);

  return (
    <div
      className={`grid gap-6 transition-all duration-300 ${
        selectedTenant ? "grid-cols-2" : "grid-cols-1"
      }`}
    >
      <div>
        <TenantTable tenants={tenants} loading={loading} />
      </div>

      {selectedTenant && (
        <div className="relative">
          <TenantDetailCard />
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchCustomers,
  fetchInvoiceCustomers,
  selectCustomers,
} from "@/lib/redux/slices/customersSlice";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";
import { CustomerDataTable } from "@/components/tables/customer-data-table/CustomerDataTable";
import {
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from "@/lib/redux/slices/productsSlice";
import { selectUserPermissions } from "@/lib/redux/slices/authSlice";

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const tenant = useAppSelector(selectCurrentTenant);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const userPermissions = useAppSelector(selectUserPermissions);

  useEffect(() => {
    if (tenant?.id) dispatch(fetchInvoiceCustomers(tenant.id));
  }, [dispatch, tenant?.id]);

  return (
    <CustomerDataTable data={customers} userPermissions={userPermissions} />
  );
}

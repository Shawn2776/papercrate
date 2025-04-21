"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchInvoices,
  selectInvoices,
} from "@/lib/redux/slices/invoicesSlice";
import { InvoiceDataTable } from "@/components/tables/invoice-data-table/InvoiceDataTable";
import { selectUserPermissions } from "@/lib/redux/slices/authSlice";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";

export default function InvoicesPage() {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector(selectInvoices);
  const userPermissions = useAppSelector(selectUserPermissions); // ✅ NEW
  const tenant = useAppSelector(selectCurrentTenant);

  useEffect(() => {
    if (tenant?.id) {
      dispatch(fetchInvoices(tenant.id)); // or whatever param your fetchInvoices thunk expects
    }
  }, [dispatch, tenant?.id]);

  return (
    <InvoiceDataTable
      data={invoices}
      userPermissions={userPermissions ?? []} // ✅ FIX
    />
  );
}

"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchInvoices,
  selectInvoices,
} from "@/lib/redux/slices/invoicesSlice";
import { InvoiceDataTable } from "@/components/tables/invoice-data-table/InvoiceDataTable";
import { selectUserPermissions } from "@/lib/redux/slices/authSlice";

export default function InvoicesPage() {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector(selectInvoices);
  const userPermissions = useAppSelector(selectUserPermissions); // ✅ NEW

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  return (
    <InvoiceDataTable
      data={invoices}
      userPermissions={userPermissions ?? []} // ✅ FIX
    />
  );
}

"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchInvoices,
  selectInvoices,
} from "@/lib/redux/slices/invoicesSlice";
import { InvoiceDataTable } from "@/components/tables/invoice-data-table/InvoiceDataTable";
import { columns } from "@/components/tables/invoice-data-table/columns";

export default function InvoicesPage() {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector(selectInvoices);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  return <InvoiceDataTable columns={columns} data={invoices} />;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";

import { fetchCustomers } from "@/lib/redux/slices/customersSlice";
import { fetchProducts } from "@/lib/redux/slices/productsSlice";
import { fetchDiscounts } from "@/lib/redux/slices/discountsSlice";
import { fetchTaxRates } from "@/lib/redux/slices/taxRatesSlice";
import { fetchStatuses } from "@/lib/redux/slices/statusesSlice";

import { InvoiceFormValues } from "@/lib/schemas";
import UpdatedNewInvoiceForm from "@/components/forms/new-invoice/UpdatedNewInvoiceForm";

export default function NewInvoicePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
    dispatch(fetchDiscounts());
    dispatch(fetchTaxRates());
    dispatch(fetchStatuses());
  }, [dispatch]);

  const handleCreateInvoice = async (data: InvoiceFormValues) => {
    console.log("Submitting invoice:", data);
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/dashboard/invoices");
    } else {
      const msg = await res.text();
      alert(`Failed to create invoice: ${msg}`);
    }
  };

  return (
    <UpdatedNewInvoiceForm onSubmit={handleCreateInvoice} loading={false} />
  );
  // return <NewInvoiceForm />;
}

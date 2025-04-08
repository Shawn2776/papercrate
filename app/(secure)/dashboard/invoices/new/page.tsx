"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

import {
  fetchCustomers,
  selectCustomers,
} from "@/lib/redux/slices/customersSlice";
import {
  fetchProducts,
  selectProducts,
} from "@/lib/redux/slices/productsSlice";
import {
  fetchDiscounts,
  selectDiscounts,
} from "@/lib/redux/slices/discountsSlice";
import {
  fetchTaxRates,
  selectTaxRates,
} from "@/lib/redux/slices/taxRatesSlice";
import {
  fetchStatuses,
  selectStatuses,
} from "@/lib/redux/slices/statusesSlice";

import NewInvoiceForm from "@/components/forms/new-invoice/NewInvoiceForm";
import { InvoiceFormValues } from "@/lib/schemas";

export default function NewInvoicePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const customers = useAppSelector(selectCustomers);
  const products = useAppSelector(selectProducts);
  const discounts = useAppSelector(selectDiscounts);
  const taxRates = useAppSelector(selectTaxRates);
  const statuses = useAppSelector(selectStatuses);

  console.log("✅ Customers from Redux:", customers);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
    dispatch(fetchDiscounts());
    dispatch(fetchTaxRates());
    dispatch(fetchStatuses());
  }, [dispatch]);

  const handleCreateInvoice = async (data: InvoiceFormValues) => {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/dashboard/invoices");
    } else {
      const errorText = await res.text();
      alert(`Failed to create invoice: ${errorText}`);
    }
  };

  return (
    <NewInvoiceForm
      customers={customers}
      products={products}
      discounts={discounts}
      taxRates={taxRates}
      statuses={statuses}
      onSubmit={handleCreateInvoice}
    />
  );
}

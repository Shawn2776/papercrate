"use client";

import { useEffect, useState } from "react";
import CustomerDropdown from "./CustomerDropdown";
import ManualCustomerForm from "./ManualCustomerForm";
import { InvoiceMetadataForm } from "./InvoiceMetadataForm";
import { LineItemsSection } from "./LineItemsSection";
import { InvoiceTotalsAndNotes } from "./InvoiceTotalsAndNotes";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "@/lib/redux/slices/customersSlice";
import { fetchProducts } from "@/lib/redux/slices/productsSlice";
import { fetchServices } from "@/lib/redux/slices/servicesSlice";
import { fetchTaxRates } from "@/lib/redux/slices/taxRatesSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewInvoiceForm() {
  const [viewMode, setViewMode] = useState("input");
  const [customerMode, setCustomerMode] = useState("select");
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [selectedTaxRateId, setSelectedTaxRateId] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
    dispatch(fetchServices());
    dispatch(fetchTaxRates());
  }, [dispatch]);

  const business = useSelector((state) => state.business.item);
  const businessId = business?.id;
  const taxRates = useSelector((state) => state.taxRates.items);
  const selectedTaxRate = taxRates.find((r) => r.id === selectedTaxRateId);
  const taxRatePercent = selectedTaxRate ? selectedTaxRate.rate : 0;

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("You must add at least one line item.");
      return;
    }

    if (!customerId) {
      toast.error("Please select or add a customer.");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const { name, unit, quantity, rate } = items[i];
      if (!name || !unit) {
        toast.error(`Line item ${i + 1} is missing name or unit.`);
        return;
      }
      if (!Number.isFinite(quantity) || quantity < 1) {
        toast.error(`Line item ${i + 1} has an invalid quantity.`);
        return;
      }
      if (!Number.isFinite(rate) || rate < 0) {
        toast.error(`Line item ${i + 1} has an invalid rate.`);
        return;
      }
    }

    const payload = {
      businessId,
      customerId,
      invoiceDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      status: "DRAFT",
      notes: "Thank you for your business!",
      taxRateId: selectedTaxRateId,
      taxRatePercent,
      items: items.map((item) => ({
        ...item,
        rate: Number(item.rate),
        quantity: Number(item.quantity),
      })),
    };

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      const result = await res.json();
      toast.success(`Invoice #${result.number} created successfully!`);
      router.push("/dashboard/invoices");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong saving the invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Invoice</h1>
        <div className="space-x-2">
          <button
            className={`px-3 py-1 rounded ${
              viewMode === "input" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => setViewMode("input")}
          >
            Input Mode
          </button>
          <button
            className={`px-3 py-1 rounded ${
              viewMode === "visual" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => toast("Visual mode coming soon")}
          >
            Visual Mode
          </button>
        </div>
      </div>

      <div className="space-y-2 border p-4 rounded">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Customer</h2>
          <button
            className="text-sm underline"
            onClick={() =>
              setCustomerMode((prev) =>
                prev === "select" ? "manual" : "select"
              )
            }
          >
            {customerMode === "select"
              ? "Switch to manual entry"
              : "Switch to select from list"}
          </button>
        </div>

        {customerMode === "select" ? (
          <CustomerDropdown
            customerId={customerId}
            setCustomerId={setCustomerId}
          />
        ) : (
          <ManualCustomerForm />
        )}
      </div>

      <InvoiceMetadataForm />
      <LineItemsSection items={items} setItems={setItems} />

      <InvoiceTotalsAndNotes items={items} />

      <div className="flex justify-end pt-4 space-x-2">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <DropdownMenu>
          <div className="flex">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-r-none"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Invoice
            </Button>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-l-none px-2"
                disabled={isSubmitting}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                toast("Saved as draft (not implemented)");
              }}
            >
              📜 Save as Draft
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

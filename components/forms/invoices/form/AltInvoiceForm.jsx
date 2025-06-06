"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, Save, Send } from "lucide-react";

import CustomerDropdown from "@/components/forms/invoices/form/CustomerDropdown";
import { InvoiceMetadataForm } from "@/components/forms/invoices/form/InvoiceMetadataForm";
import { LineItemsSection } from "@/components/forms/invoices/form/LineItemsSection";
import { InvoiceTotalsAndNotes } from "@/components/forms/invoices/form/InvoiceTotalsAndNotes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { fetchCustomers } from "@/lib/redux/slices/customersSlice";
import { fetchProducts } from "@/lib/redux/slices/productsSlice";
import { fetchServices } from "@/lib/redux/slices/servicesSlice";
import { fetchTaxRates } from "@/lib/redux/slices/taxRatesSlice";
import { useNextInvoiceNumber } from "@/hooks/useNextInvoiceNumber";

export default function NewInvoiceForm({ invoiceId = null }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const business = useSelector((state) => state.business.item);
  const businessId = business?.id;

  const [customerId, setCustomerId] = useState(null);
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("DRAFT");
  const [notes, setNotes] = useState("Thank you for your business!");
  const [selectedTaxRateId, setSelectedTaxRateId] = useState(null);
  const { invoiceNumber, isLoading, isError, refresh } = useNextInvoiceNumber();
  const [initialInvoiceNumber, setInitialInvoiceNumber] = useState(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);

  const taxRates = useSelector((state) => state.taxRates.items);
  const selectedTaxRate = taxRates.find((r) => r.id === selectedTaxRateId);
  const taxRatePercent = selectedTaxRate ? selectedTaxRate.rate : 0;

  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
    dispatch(fetchServices());
    dispatch(fetchTaxRates());
  }, [dispatch]);

  useEffect(() => {
    if (!invoiceId) return;

    const fetchInvoice = async () => {
      setIsLoadingInvoice(true);
      try {
        const res = await fetch(`/api/invoices/${invoiceId}`);
        const data = await res.json();

        // Set form state with loaded invoice data
        setCustomerId(data.customerId || null);
        setInvoiceDate(data.invoiceDate.split("T")[0]);
        setDueDate(data.dueDate.split("T")[0]);
        setStatus(data.status);
        setNotes(data.notes || "");
        setSelectedTaxRateId(data.taxRateId || null);
        setItems(
          data.LineItem.map((item) => ({
            name: item.name,
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            rate: parseFloat(item.rate),
            type: item.type || "product",
          }))
        );
      } catch (err) {
        console.error("Failed to load invoice:", err);
      } finally {
        setIsLoadingInvoice(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  useEffect(() => {
    if (
      !initialInvoiceNumber &&
      invoiceNumber &&
      invoiceNumber !== "(loading...)"
    ) {
      setInitialInvoiceNumber(invoiceNumber);
    }
  }, [invoiceNumber, initialInvoiceNumber]);

  useEffect(() => {
    setIsDirty(true);
  }, [
    customerId,
    items,
    invoiceDate,
    dueDate,
    notes,
    status,
    selectedTaxRateId,
  ]);

  useEffect(() => {
    if (!invoiceId) return; // only auto-save existing drafts

    const interval = setInterval(async () => {
      if (!isDirty) return;

      const payload = {
        businessId,
        customerId,
        invoiceDate,
        dueDate,
        status: "DRAFT", // force draft
        notes,
        taxRateId: selectedTaxRateId,
        taxRatePercent: selectedTaxRate?.rate || null,
        items: items.map((item) => ({
          name: item.name,
          unit: item.unit,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
          description: item.description || "",
          type: item.type || "product",
        })),
      };

      try {
        const res = await fetch(`/api/invoices/${invoiceId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setIsDirty(false);
          setLastSavedAt(new Date());
        } else {
          console.warn("Auto-save failed");
        }
      } catch (err) {
        console.error("Auto-save error:", err);
      }
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, [
    invoiceId,
    isDirty,
    customerId,
    invoiceDate,
    dueDate,
    notes,
    status,
    selectedTaxRateId,
    items,
    businessId,
  ]);

  const numberChanged =
    initialInvoiceNumber && invoiceNumber !== initialInvoiceNumber;

  const handleSubmit = async () => {
    if (!customerId) {
      toast.error("Please select or add a customer.");
      return;
    }

    if (items.length === 0) {
      toast.error("You must add at least one line item.");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.name || !item.unit) {
        toast.error(`Line item ${i + 1} is missing name or unit.`);
        return;
      }
      if (!Number.isFinite(item.quantity) || item.quantity < 1) {
        toast.error(`Line item ${i + 1} has an invalid quantity.`);
        return;
      }
      if (!Number.isFinite(item.rate) || item.rate < 0) {
        toast.error(`Line item ${i + 1} has an invalid rate.`);
        return;
      }
    }

    const payload = {
      businessId,
      customerId,
      invoiceDate,
      dueDate,
      status,
      notes,
      taxRateId: selectedTaxRateId,
      taxRatePercent,
      items: items.map((item) => ({
        name: item.name,
        unit: item.unit,
        quantity: Number(item.quantity),
        rate: Number(item.rate),
        description: item.description || "",
        type: item.type || "product",
      })),
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(
        invoiceId ? `/api/invoices/${invoiceId}` : "/api/invoices",
        {
          method: invoiceId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to save");

      const result = await res.json();
      const customerRes = await fetch(`/api/customers/${result.customerId}`);
      const customer = await customerRes.json();
      toast.success(`Invoice #${result.number} created successfully!`);

      try {
        await fetch("/api/invoices/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: customer.email,
            invoiceData: result, // or format however your email template expects
          }),
        });

        toast.success("Invoice sent to customer!");
      } catch (sendErr) {
        console.error("Email send failed:", sendErr);
        toast.warning("Invoice saved, but failed to send email.");
      }

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
          <button className="px-3 py-1 rounded bg-black text-white">
            Input Mode
          </button>
        </div>
      </div>

      {numberChanged && (
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-4 py-2 rounded text-sm">
          Invoice number has changed to <strong>{invoiceNumber}</strong> since
          you opened the form.
        </div>
      )}

      <div className="space-y-2 border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Customer</h2>
        <CustomerDropdown
          customerId={customerId}
          setCustomerId={setCustomerId}
        />
      </div>

      <InvoiceMetadataForm
        invoiceNumber={invoiceNumber}
        onRefreshInvoiceNumber={refresh}
        invoiceDate={invoiceDate}
        setInvoiceDate={setInvoiceDate}
        dueDate={dueDate}
        setDueDate={setDueDate}
        status={status}
        setStatus={setStatus}
      />

      <LineItemsSection items={items} setItems={setItems} />

      <InvoiceTotalsAndNotes
        items={items}
        notes={notes}
        setNotes={setNotes}
        selectedTaxRateId={selectedTaxRateId}
        setSelectedTaxRateId={setSelectedTaxRateId}
      />

      <div>
        {lastSavedAt && (
          <p className="text-xs text-gray-500">
            Auto-saved at {lastSavedAt.toLocaleTimeString()}
          </p>
        )}
      </div>

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
              <Send className="mr-2 h-4 w-4" />
              Send Invoice
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
              onClick={async () => {
                const payload = {
                  businessId,
                  customerId,
                  invoiceDate,
                  dueDate,
                  status: "DRAFT",
                  notes,
                  taxRateId: selectedTaxRateId,
                  taxRatePercent,
                  items: items.map((item) => ({
                    name: item.name,
                    unit: item.unit,
                    quantity: Number(item.quantity),
                    rate: Number(item.rate),
                    description: item.description || "",
                    type: item.type || "product",
                  })),
                };

                try {
                  const res = await fetch("/api/invoices", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });

                  if (!res.ok) throw new Error("Failed to save draft");

                  const result = await res.json();
                  toast.success(`Draft saved as Invoice #${result.number}`);
                  router.push("/dashboard/invoices");
                } catch (err) {
                  console.error(err);
                  toast.error("Something went wrong saving draft.");
                }
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

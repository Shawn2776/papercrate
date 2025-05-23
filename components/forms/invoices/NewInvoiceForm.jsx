"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { toast } from "sonner";
import { fetchCustomers } from "@/lib/redux/slices/customersSlice";
import { fetchProducts } from "@/lib/redux/slices/productsSlice";
import { fetchServices } from "@/lib/redux/slices/servicesSlice";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be 0 or greater"),
  unit: z.string().min(1, "Unit is required"),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  dueDate: z.string().min(1, "Due date is required"),
  poNumber: z.string().optional(),
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().optional(),
  terms: z.string().optional(),
  lineItems: z
    .array(lineItemSchema)
    .min(1, "At least one line item is required"),
});

function isBusinessInfoComplete(business) {
  return !!(
    business?.name &&
    business?.addressLine1 &&
    business?.city &&
    business?.state &&
    business?.postalCode
  );
}

export default function NewInvoiceForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isSignedIn, isLoaded } = useUser();

  const customers = useSelector((state) => state.customers.items);
  const loadingCustomers = useSelector((state) => state.customers.loading);
  const products = useSelector((state) => state.products.items);
  const services = useSelector((state) => state.services.items);
  const business = useSelector((state) => state.business.item);
  const loadingBusiness = useSelector((state) => state.business.loading);

  const [hasCheckedBusiness, setHasCheckedBusiness] = useState(false);

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      dispatch(fetchCustomers());
      dispatch(fetchProducts());
      dispatch(fetchServices());
    }
  }, [isSignedIn, isLoaded, dispatch]);

  useEffect(() => {
    if (!loadingBusiness) {
      setHasCheckedBusiness(true);
    }
  }, [loadingBusiness]);

  const [form, setForm] = useState({
    customerId: "",
    dueDate: "",
    poNumber: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    lineItems: [],
    terms: "",
  });

  const addLineItem = () => {
    setForm((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { description: "", quantity: 1, rate: 0, unit: "" },
      ],
    }));
  };

  const updateLineItem = (index, field, value) => {
    const updated = [...form.lineItems];
    updated[index][field] = value;
    setForm({ ...form, lineItems: updated });
  };

  const subtotal = form.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const tax = subtotal * 0.0625;
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = invoiceSchema.safeParse(form);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      toast.error(firstError?.message || "Invalid form");
      return;
    }

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (res.ok) {
        toast.success("Invoice created");
        router.push("/dashboard/invoices");
      } else {
        const msg = await res.text();
        toast.error(msg || "Failed to create invoice");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  if (!hasCheckedBusiness || loadingCustomers) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading business and customer info...
      </div>
    );
  }

  if (!isBusinessInfoComplete(business)) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded text-sm">
          ⚠️ Please complete your Business Details before creating an invoice.{" "}
          <a
            href="/dashboard/business/edit"
            className="underline text-blue-700"
          >
            Edit Business Info
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between">
        <div className="text-sm">
          <h2 className="text-xl font-semibold">{business?.name}</h2>
          <p>{business?.addressLine1}</p>
          <p>
            {business?.city}, {business?.state} {business?.postalCode}
          </p>
        </div>
        <div className="text-2xl font-bold">INVOICE</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="font-semibold">Bill To</label>
          <select
            className="w-full border rounded p-2"
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Ship To</label>
          <Textarea disabled value="(Same as billing)" />
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Invoice #"
            value={form.invoiceNumber}
            onChange={(e) =>
              setForm({ ...form, invoiceNumber: e.target.value })
            }
          />
          <Input
            type="date"
            value={form.invoiceDate}
            onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
          />
          <Input
            placeholder="PO#"
            value={form.poNumber}
            onChange={(e) => setForm({ ...form, poNumber: e.target.value })}
          />
          <Input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2">QTY</th>
              <th className="border px-2">DESCRIPTION</th>
              <th className="border px-2">UNIT</th>
              <th className="border px-2">UNIT PRICE</th>
              <th className="border px-2">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {form.lineItems.map((item, index) => (
              <tr key={index}>
                <td className="border px-2">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(index, "quantity", Number(e.target.value))
                    }
                  />
                </td>
                <td className="border px-2">
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(index, "description", e.target.value)
                    }
                  />
                </td>
                <td className="border px-2">
                  <Input
                    value={item.unit}
                    onChange={(e) =>
                      updateLineItem(index, "unit", e.target.value)
                    }
                  />
                </td>
                <td className="border px-2">
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      updateLineItem(index, "rate", Number(e.target.value))
                    }
                  />
                </td>
                <td className="border px-2 text-right">
                  ${(item.quantity * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button onClick={addLineItem} type="button" className="mt-2">
          + Add Line Item
        </Button>
      </div>

      <div className="text-right space-y-1">
        <div>Subtotal: ${subtotal.toFixed(2)}</div>
        <div>Sales Tax 6.25%: ${tax.toFixed(2)}</div>
        <div className="font-semibold text-lg">TOTAL: ${total.toFixed(2)}</div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Terms & Conditions</h3>
        <Textarea
          value={form.terms}
          onChange={(e) => setForm({ ...form, terms: e.target.value })}
          placeholder="Payment is due within 15 days."
        />
      </div>

      <div className="text-right mt-4">
        <Button type="submit" disabled={form.lineItems.length === 0}>
          Save Invoice
        </Button>
      </div>
    </form>
  );
}

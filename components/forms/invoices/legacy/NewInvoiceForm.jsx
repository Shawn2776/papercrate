"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchCustomers } from "@/lib/redux/slices/customersSlice";
import { fetchProducts } from "@/lib/redux/slices/productsSlice";
import { fetchServices } from "@/lib/redux/slices/servicesSlice";
import { z } from "zod";

const lineItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  rate: z.coerce.number().min(0, "Rate must be 0 or greater"),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  dueDate: z.string().min(1, "Due date is required"),
  invoiceNumber: z.string().optional(),
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

  const [form, setForm] = useState({
    customerId: "",
    dueDate: "",
    invoiceNumber: "",
    terms: "",
    lineItems: [],
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = invoiceSchema.safeParse(form);

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      toast.error("Please fix form errors.");
      return;
    }

    setErrors({});

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
        const contentType = res.headers.get("content-type");
        let msg = "Failed to create invoice";

        if (contentType?.includes("application/json")) {
          const errorData = await res.json();
          const fieldErrors = Object.values(errorData)
            .flat()
            .filter(Boolean)
            .join(", ");
          msg = fieldErrors || msg;
        } else {
          msg = await res.text();
        }

        toast.error(msg);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Customer</label>
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
          {errors.customerId && (
            <p className="text-sm text-red-600 mt-1">{errors.customerId[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <Input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          {errors.dueDate && (
            <p className="text-sm text-red-600 mt-1">{errors.dueDate[0]}</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg">Line Items</h3>
        {form.lineItems.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2"
          >
            <select
              className="w-full border rounded p-2"
              value={item.name || ""}
              onChange={(e) => {
                const selectedId = e.target.value;
                const product = products.find((p) => p.id === selectedId);
                const service = services.find((s) => s.id === selectedId);
                const selected = product || service;
                const updated = [...form.lineItems];
                updated[index] = {
                  name: selected?.name || "",
                  unit: selected?.unit || "",
                  quantity: 1,
                  rate: selected?.rate || selected?.price || 0,
                };
                setForm({ ...form, lineItems: updated });
              }}
            >
              <option value="">Select Product or Service</option>
              <optgroup label="Products">
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Services">
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <Input
              type="number"
              placeholder="Quantity"
              value={item.quantity || 0}
              onChange={(e) => {
                const updated = [...form.lineItems];
                updated[index].quantity = Number(e.target.value);
                setForm({ ...form, lineItems: updated });
              }}
            />
            <Input
              type="number"
              placeholder="Rate"
              value={item.rate || 0}
              onChange={(e) => {
                const updated = [...form.lineItems];
                updated[index].rate = Number(e.target.value);
                setForm({ ...form, lineItems: updated });
              }}
            />
            <Input
              placeholder="Unit"
              value={item.unit || ""}
              onChange={(e) => {
                const updated = [...form.lineItems];
                updated[index].unit = e.target.value;
                setForm({ ...form, lineItems: updated });
              }}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                const updated = [...form.lineItems];
                updated.splice(index, 1);
                setForm({ ...form, lineItems: updated });
              }}
            >
              Remove
            </Button>
          </div>
        ))}
        {errors.lineItems && (
          <p className="text-sm text-red-600 mt-1">{errors.lineItems[0]}</p>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setForm({
              ...form,
              lineItems: [
                ...form.lineItems,
                { name: "", unit: "", quantity: 1, rate: 0 },
              ],
            })
          }
        >
          + Add Line Item
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium">Terms</label>
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

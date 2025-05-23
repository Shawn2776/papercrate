"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewInvoiceForm() {
  const router = useRouter();
  const customers = useSelector((state) => state.customers.items);
  const products = useSelector((state) => state.products.items);
  const services = useSelector((state) => state.services.items);

  const [form, setForm] = useState({
    customerId: "",
    dueDate: "",
    lineItems: [
      {
        type: "custom",
        refId: null,
        name: "",
        description: "",
        quantity: 1,
        unit: "",
        rate: 0,
      },
    ],
    tax: 0.1,
  });

  const handleChange = (index, field, value) => {
    const updated = [...form.lineItems];
    updated[index][field] =
      field === "rate" || field === "quantity" ? Number(value) : value;
    setForm({ ...form, lineItems: updated });
  };

  const handleTypeChange = (index, type, id) => {
    const updated = [...form.lineItems];
    updated[index].type = type;
    updated[index].refId = id;

    let ref;
    if (type === "product") ref = products.find((p) => p.id === id);
    if (type === "service") ref = services.find((s) => s.id === id);

    if (ref) {
      updated[index].name = ref.name;
      updated[index].description = ref.description || "";
      updated[index].unit = ref.unit;
      updated[index].rate = type === "product" ? ref.price : ref.rate;
    }

    setForm({ ...form, lineItems: updated });
  };

  const addItem = () => {
    setForm({
      ...form,
      lineItems: [
        ...form.lineItems,
        {
          type: "custom",
          refId: null,
          name: "",
          description: "",
          quantity: 1,
          unit: "",
          rate: 0,
        },
      ],
    });
  };

  const removeItem = (index) => {
    const updated = form.lineItems.filter((_, i) => i !== index);
    setForm({ ...form, lineItems: updated });
  };

  const subtotal = form.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const taxAmount = subtotal * form.tax;
  const total = subtotal + taxAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      dueDate: new Date(form.dueDate).toISOString(),
      lineItems: form.lineItems.map((item) => ({
        ...item,
        rate: Number(item.rate),
        quantity: Number(item.quantity),
      })),
    };

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const errText = await res.text();
      console.error("Failed to create invoice:", res.status, errText);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">New Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label>Customer</Label>
              <select
                value={form.customerId}
                onChange={(e) =>
                  setForm({ ...form, customerId: e.target.value })
                }
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b font-semibold text-left">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2">Description</th>
                  <th className="py-2">Unit</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Rate</th>
                  <th className="py-2 text-right">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {form.lineItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">
                      <select
                        value={`${item.type}:${item.refId || ""}`}
                        onChange={(e) => {
                          const [type, id] = e.target.value.split(":");
                          handleTypeChange(index, type, id);
                        }}
                        className="border rounded w-full"
                      >
                        <option value="custom">Custom</option>
                        <optgroup label="Products">
                          {products.map((p) => (
                            <option key={p.id} value={`product:${p.id}`}>
                              {p.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Services">
                          {services.map((s) => (
                            <option key={s.id} value={`service:${s.id}`}>
                              {s.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      {item.type === "custom" && (
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            handleChange(index, "name", e.target.value)
                          }
                          placeholder="Item name"
                          className="mt-1"
                        />
                      )}
                    </td>
                    <td className="py-2">
                      <Textarea
                        value={item.description}
                        onChange={(e) =>
                          handleChange(index, "description", e.target.value)
                        }
                        placeholder="Optional"
                      />
                    </td>
                    <td className="py-2">
                      <Input
                        value={item.unit}
                        onChange={(e) =>
                          handleChange(index, "unit", e.target.value)
                        }
                      />
                    </td>
                    <td className="py-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleChange(index, "quantity", e.target.value)
                        }
                        min={1}
                      />
                    </td>
                    <td className="py-2">
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleChange(index, "rate", e.target.value)
                        }
                        min={0}
                        step="0.01"
                      />
                    </td>
                    <td className="py-2 text-right">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </td>
                    <td className="py-2 text-right">
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={form.lineItems.length === 1}
                      >
                        ×
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2">
              <Button type="button" onClick={addItem} variant="outline">
                Add Line Item
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1 text-right">
            <div>Subtotal: ${subtotal.toFixed(2)}</div>
            <div>Tax (10%): ${taxAmount.toFixed(2)}</div>
            <div className="text-lg font-semibold">
              Total: ${total.toFixed(2)}
            </div>
          </div>

          <div className="text-right">
            <Button type="submit" className="mt-4">
              Save Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";

export function InvoiceTotalsAndNotes({ items = [] }) {
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState("");
  const [notes, setNotes] = useState("Thank you for your business!");

  useEffect(() => {
    const newSubtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
    setSubtotal(newSubtotal);
  }, [items]);

  const taxAmount = subtotal * ((parseFloat(tax) || 0) / 100);
  const total = subtotal + taxAmount;
  const balanceDue = total;

  return (
    <div className="space-y-4 border p-4 rounded">
      <h2 className="text-lg font-semibold">Totals & Notes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">
            Special Notes or Payment Terms
          </label>
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <label htmlFor="tax" className="mr-2">
              Tax (%):
            </label>
            <input
              id="tax"
              type="number"
              placeholder="e.g. 25"
              className="border p-1 rounded w-24 text-right"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
            />
          </div>

          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Balance Due:</span>
            <span>${balanceDue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

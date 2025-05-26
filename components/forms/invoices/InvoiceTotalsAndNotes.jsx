"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTaxRates, createTaxRate } from "@/lib/redux/slices/taxRatesSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TaxRateModal from "./TaxRateModal";

export function InvoiceTotalsAndNotes({ items }) {
  const dispatch = useDispatch();
  const [subtotal, setSubtotal] = useState(0);
  const [notes, setNotes] = useState("Thank you for your business!");
  const [selectedTaxRateId, setSelectedTaxRateId] = useState(null);
  const [showTaxModal, setShowTaxModal] = useState(false);

  const taxRates = useSelector((state) => state.taxRates.items);
  const selectedTaxRate = taxRates.find((r) => r.id === selectedTaxRateId);
  const taxRatePercent = selectedTaxRate ? selectedTaxRate.rate : 0;

  useEffect(() => {
    dispatch(fetchTaxRates());
  }, [dispatch]);

  useEffect(() => {
    if (taxRates.length > 0 && !selectedTaxRateId) {
      const defaultRate = taxRates.find((r) => r.isDefault);
      if (defaultRate) {
        setSelectedTaxRateId(defaultRate.id);
      }
    }
  }, [taxRates, selectedTaxRateId]);

  useEffect(() => {
    const newSubtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
    setSubtotal(newSubtotal);
  }, [items]);

  const taxAmount = subtotal * ((parseFloat(taxRatePercent) || 0) / 100);
  const total = subtotal + taxAmount;
  const balanceDue = total;

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setShowTaxModal(true);
      setSelectedTaxRateId(null);
    } else {
      setSelectedTaxRateId(value);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded">
      <h2 className="text-lg font-semibold">Totals & Notes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
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
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap">
                Tax:
              </label>
              <select
                value={selectedTaxRateId || ""}
                onChange={handleChange}
                className="border p-1 rounded text-sm"
              >
                <option value="new">+ Add New Tax Rate</option>
                {taxRates.map((rate) => (
                  <option key={rate.id} value={rate.id}>
                    {rate.name} ({rate.rate}%)
                    {rate.isDefault ? " (default)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <span>${taxAmount.toFixed(2)}</span>
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

      {showTaxModal && (
        <TaxRateModal
          onClose={() => setShowTaxModal(false)}
          onSave={(newRate) => {
            dispatch(createTaxRate(newRate)).then((action) => {
              if (action.payload?.id) {
                setSelectedTaxRateId(action.payload.id);
                toast.success("Tax rate added");
                setShowTaxModal(false);
              }
            });
          }}
        />
      )}
    </div>
  );
}

// components/forms/invoices/TaxRateSelector.jsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxRates } from "@/lib/redux/slices/taxRatesSlice";

export default function TaxRateSelector({
  selectedTaxRateId,
  setSelectedTaxRateId,
}) {
  const dispatch = useDispatch();
  const { items: taxRates, loading } = useSelector((state) => state.taxRates);

  useEffect(() => {
    dispatch(fetchTaxRates());
  }, [dispatch]);

  return (
    <div className="space-y-1">
      <label className="font-medium">Tax Rate</label>
      <select
        value={selectedTaxRateId || ""}
        onChange={(e) => setSelectedTaxRateId(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">-- No Tax --</option>
        {taxRates.map((rate) => (
          <option key={rate.id} value={rate.id}>
            {rate.name} ({rate.rate}%)
          </option>
        ))}
      </select>
    </div>
  );
}

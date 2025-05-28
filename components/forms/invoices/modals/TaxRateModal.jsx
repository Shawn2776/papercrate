"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TaxRateModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    isDefault: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    const parsedRate = parseFloat(formData.rate);
    if (!formData.name || isNaN(parsedRate)) {
      return alert("Please enter a name and a valid rate.");
    }
    onSave({
      name: formData.name,
      rate: parsedRate,
      isDefault: formData.isDefault,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Tax Rate</h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            name="name"
            placeholder="Tax name (e.g., Sales Tax)"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="rate"
            type="number"
            placeholder="Rate (e.g., 6.5)"
            value={formData.rate}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            <label htmlFor="isDefault" className="text-sm">
              Set as default tax rate
            </label>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </div>
  );
}

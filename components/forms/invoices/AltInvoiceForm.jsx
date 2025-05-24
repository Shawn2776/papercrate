"use client";

import { useState } from "react";
import CustomerDropdown from "./CustomerDropdown";
import ManualCustomerForm from "./ManualCustomerForm";
import { InvoiceMetadataForm } from "./InvoiceMetadataForm";
import { LineItemsSection } from "./LineItemsSection";
import { InvoiceTotalsAndNotes } from "./InvoiceTotalsAndNotes";

export default function NewInvoiceForm() {
  const [viewMode, setViewMode] = useState("input"); // 'input' or 'visual'
  const [customerMode, setCustomerMode] = useState("select"); // 'select' or 'manual'
  const [items, setItems] = useState([]); // 🟩 top-level line items

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Top Toggle */}
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
            onClick={() => alert("Visual mode coming soon")}
          >
            Visual Mode
          </button>
        </div>
      </div>

      {/* Step 1: Customer */}
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
          <CustomerDropdown />
        ) : (
          <ManualCustomerForm />
        )}
      </div>

      <InvoiceMetadataForm />

      {/* 🟩 Pass items + setItems to LineItemsSection */}
      <LineItemsSection items={items} setItems={setItems} />

      {/* 🟩 Pass items to Totals */}
      <InvoiceTotalsAndNotes items={items} />

      <div className="flex justify-end space-x-2 pt-4">
        <button
          onClick={() => {
            alert("Saved as Draft (functionality coming soon)");
          }}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Save Draft
        </button>

        <button
          onClick={() => {
            if (items.length === 0) {
              alert("You must add at least one product or service.");
              return;
            }

            // ✅ Add more validation as needed
            alert("Invoice submitted! (Functionality coming soon)");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Invoice
        </button>
      </div>
    </div>
  );
}

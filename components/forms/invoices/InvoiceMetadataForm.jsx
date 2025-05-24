import { useState, useEffect } from "react";

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export function InvoiceMetadataForm() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-00123"); // TODO: Replace with real logic
  const [invoiceDate, setInvoiceDate] = useState(formatDate(new Date()));
  const [dueDate, setDueDate] = useState(formatDate(new Date()));
  const [status, setStatus] = useState("DRAFT");

  return (
    <div className="space-y-2 border p-4 rounded">
      <h2 className="text-lg font-semibold">Invoice Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Invoice Number</label>
          <input
            className="w-full border p-2 rounded bg-gray-100 text-gray-500"
            value={invoiceNumber}
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="SENT">SENT</option>
            <option value="PAID">PAID</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Invoice Date</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>
    </div>
  );
}

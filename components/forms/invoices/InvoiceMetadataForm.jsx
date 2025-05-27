import { Button } from "@/components/ui/button";

export function InvoiceMetadataForm({
  invoiceNumber,
  onRefreshInvoiceNumber,
  invoiceDate,
  setInvoiceDate,
  dueDate,
  setDueDate,
  status,
  setStatus,
}) {
  return (
    <div className="space-y-2 border p-4 rounded">
      <h2 className="text-lg font-semibold">Invoice Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Invoice Number</label>
          <div className="flex items-center gap-2">
            <input
              className="w-full border p-2 rounded bg-gray-100 text-gray-500"
              value={invoiceNumber}
              readOnly
            />
            <Button
              variant={"outline"}
              type="button"
              onClick={onRefreshInvoiceNumber}
              className="text-sm px-2 py-1 "
            >
              Refresh
            </Button>
          </div>
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

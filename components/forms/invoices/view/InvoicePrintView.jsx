"use client";
import { useSelector } from "react-redux";

export default function InvoicePrintView({ invoice }) {
  const business = useSelector((state) => state.business.item);
  console.log("business:", business);

  const subtotal = invoice.LineItem.reduce(
    (sum, item) => sum + item.rate * item.quantity,
    0
  );
  const taxableAmount = invoice.LineItem.filter(
    (item) => item.type === "PRODUCT"
  ).reduce((sum, item) => sum + item.rate * item.quantity, 0);
  const taxRatePercent = Number(invoice.taxRatePercent || 0);
  const taxDue = taxableAmount * (taxRatePercent / 100);
  const total = subtotal + taxDue;

  const formattedDate = new Date(invoice.invoiceDate).toLocaleDateString();
  const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white text-black text-sm font-sans print:p-0 print:shadow-none print:border-none">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-800">
            {business?.name || "Company Name"}
          </h1>
          <p>{business?.addressLine1}</p>
          {business?.addressLine2 && <p>{business.addressLine2}</p>}
          <p>
            {business?.city}, {business?.state} {business?.postalCode}
          </p>
          <p>{business?.phone}</p>
          <p>{business?.email}</p>
        </div>

        <div className="text-right space-y-1">
          <h2 className="text-2xl font-bold text-blue-600">INVOICE</h2>
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Invoice #:</strong> {invoice.number}
          </p>
          <p>
            <strong>Customer ID:</strong> {invoice.customer?.id}
          </p>
          <p>
            <strong>Due Date:</strong> {formattedDueDate}
          </p>
        </div>
      </header>

      <section className="mb-6">
        <h3 className="font-bold text-gray-700 border-b border-gray-300 pb-1 mb-2">
          Ship To
        </h3>
        <div>
          <p>{invoice.customer?.name}</p>
          <p>{invoice.customer?.addressLine1}</p>
          <p>
            {invoice.customer?.city}, {invoice.customer?.state}{" "}
            {invoice.customer?.postalCode}
          </p>
          <p>{invoice.customer?.phone}</p>
        </div>
      </section>

      <table className="w-full mb-6 border border-gray-300">
        <thead className="bg-gray-100">
          <tr className="border-b border-gray-300">
            <th className="text-left p-2">Description</th>
            <th className="text-center p-2">Taxed</th>
            <th className="text-right p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.LineItem.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="p-2">
                {item.name} {item.description && `(${item.description})`}
              </td>
              <td className="text-center p-2">
                {item.type === "PRODUCT" ? "X" : ""}
              </td>
              <td className="text-right p-2">
                ${(item.rate * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="grid grid-cols-2 gap-6 mb-8">
        <div className="text-sm border p-4">
          <h4 className="font-semibold mb-2">Other Comments</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>Total payment due in 30 days</li>
            <li>Please include the invoice number on your check</li>
          </ul>
        </div>

        <div className="text-sm space-y-1 text-right">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Taxable: ${taxableAmount.toFixed(2)}</p>
          <p>Tax rate: {taxRatePercent.toFixed(2)}%</p>
          <p>Tax due: ${taxDue.toFixed(2)}</p>
          <p>Other: $0.00</p>
          <hr className="my-2" />
          <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
        </div>
      </section>

      <footer className="text-center text-xs border-t pt-4">
        <p>
          Make all checks payable to{" "}
          <strong>{business?.name || "Your Company Name"}</strong>
        </p>
        <p className="mt-4">Thank you for your business!</p>
        <p className="text-gray-500">
          If you have questions about this invoice, contact {business?.name},{" "}
          {business?.phone}, {business?.email}
        </p>
      </footer>
    </div>
  );
}

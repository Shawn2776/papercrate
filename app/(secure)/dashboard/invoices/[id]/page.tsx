"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { InvoiceWithRelations } from "@/lib/types/invoice";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<InvoiceWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/invoices/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      });
  }, [id]);

  if (loading || !invoice) {
    return (
      <div className="max-w-5xl mx-auto py-20 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  const primaryColor =
    invoice.tenant.InvoiceSettings?.[0]?.primaryColor ?? "#1E3A8A";
  const lineItems = invoice.InvoiceDetail;

  const subtotal = lineItems.reduce((sum, i) => sum + Number(i.lineTotal), 0);
  const tax = invoice.taxExempt ? 0 : Number(invoice.amount) - subtotal;
  const balanceDue = Number(invoice.amount);

  return (
    <div
      className="bg-white text-black max-w-[700px] mx-auto p-10 rounded-md shadow-md
             print:shadow-none print:p-0 print:rounded-none print:bg-transparent"
    >
      {/* Header */}
      <div className="border-b pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            {invoice.tenant.companyName ?? invoice.tenant.name}
          </h1>
          <p className="text-sm">
            {invoice.tenant.addressLine1}
            {invoice.tenant.addressLine2 && `, ${invoice.tenant.addressLine2}`}
          </p>
          <p className="text-sm">
            {invoice.tenant.city}, {invoice.tenant.state} {invoice.tenant.zip}
          </p>
          {invoice.tenant.email && (
            <p className="text-sm">{invoice.tenant.email}</p>
          )}
          {invoice.tenant.website && (
            <p className="text-sm">{invoice.tenant.website}</p>
          )}
        </div>
        <div className="text-right space-y-1">
          <p className="text-lg font-semibold" style={{ color: primaryColor }}>
            INVOICE
          </p>
          <p className="text-sm">Invoice #: {invoice.number ?? invoice.id}</p>
          <p className="text-sm">
            Date: {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
          <Badge variant="outline">
            {invoice.status.replace(/_/g, " ").toLowerCase()}
          </Badge>
        </div>
      </div>

      {/* Bill To / Ship To */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
        <div>
          <h3 className="font-medium mb-1" style={{ color: primaryColor }}>
            Bill To:
          </h3>
          <p>{invoice.customer.name}</p>
          <p>{invoice.customer.address}</p>
          <p>{invoice.customer.phone}</p>
          <p>{invoice.customer.email}</p>
        </div>
        <div>
          <h3 className="font-medium mb-1" style={{ color: primaryColor }}>
            Ship To:
          </h3>
          <p>{invoice.customer.name}</p>
          <p>{invoice.customer.address}</p>
          <p>{invoice.customer.phone}</p>
        </div>
      </div>

      {/* Line Items */}
      <table className="w-full border-t text-sm mb-8">
        <thead>
          <tr
            className="bg-gray-100 text-left"
            style={{ backgroundColor: primaryColor, color: "white" }}
          >
            <th className="p-2">Description</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Unit Price</th>
            <th className="p-2">Discount</th>
            <th className="p-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, idx) => (
            <tr key={item.id} className={idx % 2 ? "bg-gray-50" : ""}>
              <td className="p-2">{item.Product.name}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">${Number(item.Product.price).toFixed(2)}</td>
              <td className="p-2">
                {item.discountId
                  ? `${Number(item.Discount?.discountValue ?? 0).toFixed(0)}%`
                  : "—"}
              </td>
              <td className="p-2 text-right">
                ${Number(item.lineTotal).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Summary */}
      <div className="flex justify-end mb-6">
        <div className="w-full sm:w-1/2 md:w-1/3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {!invoice.taxExempt && (
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base border-t pt-2">
            <span>Balance Due:</span>
            <span>${balanceDue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Special Notes */}
      {invoice.specialNotes && (
        <div className="mt-6 border-t pt-4">
          <h3
            className="text-sm font-semibold mb-2"
            style={{ color: primaryColor }}
          >
            Special Notes & Instructions
          </h3>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {invoice.specialNotes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="text-sm text-muted-foreground border-t pt-4 text-center">
        <p>Thank you for your business!</p>
        <p className="italic">Payment is due upon receipt.</p>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function InvoicePage({ params }) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      LineItem: true,
    },
  });

  if (!invoice) return notFound();

  const subtotal = invoice.LineItem.reduce(
    (sum, item) => sum + item.rate * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-2xl font-bold">Invoice {invoice.number}</h1>
      <p className="text-muted-foreground">Status: {invoice.status}</p>
      <div className="text-muted-foreground">
        <p className="text-muted-foreground">Due: {formattedDueDate}</p>
      </div>

      <section className="border-t pt-6 space-y-2">
        <h2 className="font-semibold text-lg">Customer</h2>
        <p>{invoice.customer?.name}</p>
        <p>{invoice.customer?.email}</p>
        <p>{invoice.customer?.phone}</p>
        <p>{invoice.customer?.address}</p>
      </section>

      <section className="border-t pt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-semibold border-b">
              <th>Item</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.LineItem.map((item) => (
              <tr key={item.id} className="border-b">
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>${item.rate.toFixed(2)}</td>
                <td>${(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-4 space-y-1">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax (10%): ${tax.toFixed(2)}</p>
          <p className="font-semibold text-lg">Total: ${total.toFixed(2)}</p>
        </div>
      </section>
    </main>
  );
}

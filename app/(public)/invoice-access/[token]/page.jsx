import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function PublicInvoicePage({ params }) {
  const token = params.token;

  const accessToken = await prisma.invoiceAccessToken.findUnique({
    where: { token },
    include: {
      invoice: {
        include: {
          customer: true,
          LineItem: true,
          business: true,
        },
      },
    },
  });

  const isExpired =
    !accessToken || accessToken.expiresAt < new Date() || accessToken.used;

  if (isExpired) {
    return notFound();
  }

  // ✅ Immediately mark as used
  await prisma.invoiceAccessToken.update({
    where: { id: accessToken.id },
    data: { used: true },
  });

  const { invoice } = accessToken;
  const amount = parseFloat(invoice.amount).toFixed(2);
  const balance = (invoice.amount - (invoice.amountPaid || 0)).toFixed(2);

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white shadow mt-10 rounded">
      <h1 className="text-3xl font-bold mb-4">Invoice #{invoice.number}</h1>
      <div className="mb-6 text-sm text-gray-600">
        <p>
          <strong>Status:</strong> {invoice.status}
        </p>
        <p>
          <strong>Due Date:</strong> {invoice.dueDate.split("T")[0]}
        </p>
        <p>
          <strong>Customer:</strong> {invoice.customer?.name}
        </p>
        <p>
          <strong>Total:</strong> ${amount}
        </p>
        <p>
          <strong>Balance Due:</strong> ${balance}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Line Items</h2>
        <ul className="space-y-2 text-sm">
          {invoice.LineItem.map((item, i) => (
            <li key={i}>
              <strong>{item.name}</strong> – {item.quantity} × ${item.rate} (
              {item.unit})
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 text-sm text-gray-400">
        Sent by {invoice.business?.name} via PaperCrate.io
      </p>
    </main>
  );
}

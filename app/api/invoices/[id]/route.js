export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  const invoiceId = parseInt(params.id);
  if (!invoiceId) return new Response("Invalid invoice ID", { status: 400 });

  const body = await req.json();
  const { customerId, status, lineItems } = body;

  if (!customerId || !Array.isArray(lineItems) || lineItems.length === 0) {
    return new Response("Missing required fields", { status: 400 });
  }

  // 🔹 Fetch and version the existing invoice
  const existing = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { InvoiceDetail: true },
  });

  if (!existing) return new Response("Invoice not found", { status: 404 });

  await prisma.invoiceVersion.create({
    data: {
      invoiceId: existing.id,
      number: existing.number,
      data: existing,
      modifiedBy: dbUser.id,
    },
  });

  // 🔹 Delete old line items
  await prisma.invoiceDetail.deleteMany({
    where: { invoiceId },
  });

  // 🔹 Recalculate line totals
  const details = await Promise.all(
    lineItems.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(item.productId) },
      });

      if (!product) throw new Error(`Product not found: ${item.productId}`);

      let lineTotal = product.price * item.quantity;

      if (item.discountId) {
        const discount = await prisma.discount.findUnique({
          where: { id: parseInt(item.discountId) },
        });
        if (discount) {
          lineTotal = lineTotal * ((100 - discount.discountValue) / 100);
        }
      }

      if (item.taxId) {
        const tax = await prisma.taxRate.findUnique({
          where: { id: parseInt(item.taxId) },
        });
        if (tax) {
          lineTotal = lineTotal * ((100 + tax.rate) / 100);
        }
      }

      return {
        productId: parseInt(item.productId),
        quantity: item.quantity,
        ...(item.discountId &&
          item.discountId !== "" && {
            discountId: parseInt(item.discountId),
          }),
        ...(item.taxId &&
          item.taxId !== "" && {
            taxId: parseInt(item.taxId),
          }),
        lineTotal: Number(lineTotal.toFixed(2)),
      };
    })
  );

  // 🔹 Update the invoice
  const updated = await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      customerId: parseInt(customerId),
      status,
      amount: details.reduce((sum, item) => sum + item.lineTotal, 0),
      updatedById: dbUser.id,
      InvoiceDetail: {
        create: details,
      },
    },
  });

  return Response.json(updated);
}

export async function GET(req, { params }) {
  const id = params.id;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      tenant: true,
      InvoiceDetail: {
        include: { Product: true },
      },
    },
  });

  if (!invoice) return new Response("Not found", { status: 404 });

  return Response.json(invoice);
}

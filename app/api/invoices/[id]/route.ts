export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDbUserOrThrow } from "@/lib/functions/getDbUser";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";
import { InvoiceStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dbUser = await getDbUserOrThrow();
    const invoiceId = params.id;

    if (!invoiceId) {
      return new Response("Invalid invoice ID", { status: 400 });
    }

    const body = await req.json();
    const {
      customerId,
      status,
      specialNotes,
      lineItems,
    }: {
      customerId: string;
      status: string;
      specialNotes?: string;
      lineItems: {
        productId: string;
        quantity: number;
        discountId?: string | null;
        taxId?: string | null;
      }[];
    } = body;

    if (!customerId || !Array.isArray(lineItems) || lineItems.length === 0) {
      return new Response("Missing required fields", { status: 400 });
    }

    const existing = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { InvoiceDetail: true },
    });

    if (!existing) {
      return new Response("Invoice not found", { status: 404 });
    }

    await prisma.invoiceVersion.create({
      data: {
        invoiceId: existing.id,
        number: existing.number ?? "",
        data: existing,
        modifiedBy: dbUser.id,
      },
    });

    await prisma.invoiceDetail.deleteMany({ where: { invoiceId } });

    const details = await Promise.all(
      lineItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: Number(item.productId) },
        });
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        let lineTotal = product.price.toNumber() * item.quantity;

        if (item.discountId) {
          const discount = await prisma.discount.findUnique({
            where: { id: Number(item.discountId) },
          });
          if (discount) {
            lineTotal *= (100 - discount.discountValue.toNumber()) / 100;
          }
        }

        if (item.taxId) {
          const tax = await prisma.taxRate.findUnique({
            where: { id: Number(item.taxId) },
          });
          if (tax) {
            lineTotal *= (100 + tax.rate.toNumber()) / 100;
          }
        }

        return {
          productId: Number(item.productId),
          quantity: item.quantity,
          discountId: item.discountId ? Number(item.discountId) : null,
          taxId: item.taxId ? Number(item.taxId) : null,
          lineTotal: Math.round(lineTotal * 100) / 100, // safely round to 2 decimals
        };
      })
    );

    const totalAmount = details.reduce((sum, item) => sum + item.lineTotal, 0);

    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        customerId: Number(customerId),
        status: InvoiceStatus[status as keyof typeof InvoiceStatus],
        amount: totalAmount,
        specialNotes,
        updatedById: dbUser.id,
        InvoiceDetail: { create: details },
      },
    });

    return Response.json(updated);
  } catch (error: unknown) {
    console.error("PATCH /invoice/:id error:", error);
    return new Response(getErrorMessage(error), {
      status: 500,
    });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        tenant: {
          include: {
            InvoiceSettings: true,
          },
        },
        InvoiceDetail: {
          include: {
            Product: true,
            Discount: true,
            TaxRate: true,
          },
        },
      },
    });

    if (!invoice) return new Response("Not found", { status: 404 });

    return Response.json(invoice);
  } catch (error: unknown) {
    console.error("GET /invoice/:id error:", error);
    return new Response(getErrorMessage(error), {
      status: 500,
    });
  }
}

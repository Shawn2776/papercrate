// app > api > invoices > route.ts
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { invoiceFormSchema, InvoiceInput } from "@/lib/schemas/invoice";
import {
  generateInvoiceNumber,
  getUpdatedTenantCounter,
} from "@/lib/utils/invoice";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";

import { NextRequest } from "next/server";
import { recordAuditLog } from "@/lib/functions/recordAuditLog";

export async function GET(req: NextRequest): Promise<Response> {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  if (!dbUser || !dbUser.memberships.length) {
    return new Response("User not found or not a member of any tenant", {
      status: 404,
    });
  }

  const tenantId = dbUser.memberships[0].tenantId;

  const invoices = await prisma.invoice.findMany({
    where: {
      tenantId,
      deleted: false, // ✅ optional: skip soft-deleted
    },
    include: {
      customer: true,
      InvoiceDetail: {
        include: {
          Product: true,
          Discount: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(invoices);
}

export async function POST(req: Request): Promise<Response> {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  if (!dbUser || !dbUser.memberships.length) {
    return new Response("User not found or not a member of any tenant", {
      status: 404,
    });
  }

  const tenantId = dbUser.memberships[0].tenantId;
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

  if (!tenant) return new Response("Tenant not found", { status: 404 });

  const json = await req.json();
  const result = invoiceFormSchema.safeParse(json);

  if (!result.success) {
    const error = result.error.flatten();
    return Response.json(
      { message: "Validation failed", errors: error },
      { status: 400 }
    );
  }

  const { customerId, status, lineItems, taxRateId, taxExempt }: InvoiceInput =
    result.data;

  const taxRate = taxRateId
    ? await prisma.taxRate.findUnique({ where: { id: Number(taxRateId) } })
    : null;

  if (taxRateId && !taxRate) {
    return new Response("Tax rate not found", { status: 400 });
  }

  tenant.invoiceCounter = await getUpdatedTenantCounter(tenant);

  const details = await Promise.all(
    lineItems.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: Number(item.productId) },
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      let lineTotal = product.price.toNumber() * item.quantity;

      if (item.discountId) {
        const discount = await prisma.discount.findUnique({
          where: { id: Number(item.discountId) },
        });
        if (discount) {
          lineTotal *= (100 - discount.discountValue.toNumber()) / 100;
        }
      }

      if (!taxExempt && taxRate) {
        lineTotal *= (100 + taxRate.rate.toNumber()) / 100;
      }

      return {
        productId: Number(item.productId),
        quantity: item.quantity,
        discountId: item.discountId ? Number(item.discountId) : null,
        taxId: taxRate ? taxRate.id : null,
        lineTotal: Number(lineTotal.toFixed(2)),
      };
    })
  );

  const totalAmount = details.reduce((sum, item) => sum + item.lineTotal, 0);

  let invoice = null;
  let attempt = 0;
  const maxAttempts = 5;

  while (attempt < maxAttempts) {
    const invoiceNumber = generateInvoiceNumber(tenant);

    try {
      invoice = await prisma.invoice.create({
        data: {
          number: invoiceNumber,
          amount: totalAmount,
          status,
          createdBy: { connect: { id: dbUser.id } },
          updatedBy: { connect: { id: dbUser.id } },
          customer: { connect: { id: Number(customerId) } },
          tenant: { connect: { id: tenantId } },
          InvoiceDetail: { create: details },
        },
      });

      await recordAuditLog({
        action: "CREATE",
        entityType: "Invoice",
        entityId: invoice.id,
        userId: dbUser.id,
        after: {
          ...invoice,
          InvoiceDetail: details,
        },
      });

      await prisma.tenant.update({
        where: { id: tenantId },
        data: { invoiceCounter: { increment: 1 } },
      });

      break;
    } catch (err: unknown) {
      const message = getErrorMessage(err);

      if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code: string }).code;

        if (code === "P2002") {
          tenant.invoiceCounter++;
          attempt++;
          continue; // retry loop
        }
      }

      console.error("Invoice creation failed:", message);
      return new Response("Server error", { status: 500 });
    }
  }

  if (!invoice) {
    return new Response("Failed to generate a unique invoice number", {
      status: 500,
    });
  }

  return Response.json(
    {
      message: "Invoice created successfully",
      invoice: {
        id: invoice.id,
        number: invoice.number,
        amount: invoice.amount,
        status: invoice.status,
      },
    },
    { status: 201 }
  );
}

import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getDbUserOrRedirect } from "@/lib/auth/getDbUserOrRedirect";
import { invoiceFormSchema, InvoiceInput } from "@/lib/schemas/invoiceSchema";
import { generateInvoiceNumber } from "@/lib/utils/invoice";
import { isDuplicateInvoiceError } from "@/lib/utils/prismaErrors";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";

export async function GET(req: NextRequest): Promise<Response> {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  const url = new URL(req.url);
  const tenantId = url.searchParams.get("tenantId");

  if (!dbUser || !dbUser.memberships.length) {
    return new Response("User not found or not a member of any tenant", {
      status: 404,
    });
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      tenantId: tenantId ?? undefined,
      deleted: false,
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
    orderBy: { createdAt: "desc" },
  });

  return Response.json(invoices);
}

export async function POST(req: Request): Promise<Response> {
  try {
    const user = await currentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const dbUser = await getDbUserOrRedirect();
    const json = await req.json(); // 👈 move this above
    const tenantId = json.tenantId || dbUser.memberships?.[0]?.tenantId;
    if (!tenantId) return new Response("Missing tenant", { status: 400 });

    const result = invoiceFormSchema.safeParse(json);
    if (!result.success) {
      const error = result.error.flatten();
      return Response.json(
        { message: "Validation failed", errors: error },
        { status: 400 }
      );
    }

    const {
      customerId,
      status,
      lineItems,
      taxRateId,
      taxExempt,
      notes,
    }: InvoiceInput = result.data;

    const taxRate = taxRateId
      ? await prisma.taxRate.findUnique({ where: { id: Number(taxRateId) } })
      : null;

    if (taxRateId && !taxRate) {
      return new Response("Tax rate not found", { status: 400 });
    }

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

    // ✅ Retry-safe invoice creation
    const maxAttempts = 5;
    let invoice = null;
    let attempt = 0;

    while (attempt < maxAttempts) {
      const tenant = await prisma.tenant.update({
        where: { id: tenantId },
        data: { invoiceCounter: { increment: 1 } },
      });

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
          after: { ...invoice, InvoiceDetail: details },
        });

        break;
      } catch (err) {
        if (isDuplicateInvoiceError(err)) {
          attempt++;
          continue;
        }

        throw err;
      }
    }

    if (!invoice) {
      return new Response("Unable to generate a unique invoice number", {
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
  } catch (err) {
    console.error("❌ Invoice creation error:", err);
    return new Response(getErrorMessage(err), { status: 500 });
  }
}

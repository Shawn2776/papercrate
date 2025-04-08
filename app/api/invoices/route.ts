import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient, InvoiceStatus } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const lineItemSchema = z.object({
  productId: z.union([z.string(), z.number()]).transform(Number),
  quantity: z.number().min(1),
  discountId: z
    .union([z.string(), z.number()])
    .nullable()
    .transform((val) => (val ? Number(val) : null)),
});

const invoiceSchema = z
  .object({
    customerId: z.union([z.string(), z.number()]).transform(Number),
    status: z.nativeEnum(InvoiceStatus),
    lineItems: z
      .array(lineItemSchema)
      .min(1, "At least one line item is required."),
    taxRateId: z.union([z.string(), z.number()]).nullable().optional(),
    taxExempt: z.boolean().optional(),
    taxExemptId: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.taxExempt && !data.taxExemptId) {
      ctx.addIssue({
        path: ["taxExemptId"],
        code: z.ZodIssueCode.custom,
        message: "Tax exemption ID is required when invoice is tax-exempt.",
      });
    }
  });

type InvoiceInput = z.infer<typeof invoiceSchema>;

type TenantWithSettings = {
  id: string;
  invoiceCounter: number;
  invoicePrefix?: string | null;
  invoiceFormat?: string | null;
  lastResetYear?: number | null;
  autoResetYearly?: boolean;
};

async function getUpdatedTenantCounter(
  tenant: TenantWithSettings
): Promise<number> {
  const currentYear = new Date().getFullYear();

  if (tenant.autoResetYearly && tenant.lastResetYear !== currentYear) {
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        invoiceCounter: 1,
        lastResetYear: currentYear,
      },
    });
    tenant.invoiceCounter = 1;
    tenant.lastResetYear = currentYear;
  }

  return tenant.invoiceCounter;
}

function generateInvoiceNumber(tenant: TenantWithSettings): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const counter = String(tenant.invoiceCounter).padStart(4, "0");

  const format = tenant.invoiceFormat || "{prefix}-{year}-{counter}";
  return format
    .replace("{prefix}", tenant.invoicePrefix || "INV")
    .replace("{year}", String(year))
    .replace("{month}", month)
    .replace("{counter}", counter);
}

export async function GET(): Promise<Response> {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  if (!dbUser || !dbUser.memberships.length) {
    return new Response("User not found", { status: 404 });
  }

  const tenantId = dbUser.memberships[0]?.tenantId;

  const invoices = await prisma.invoice.findMany({
    where: {
      tenantId,
      deleted: false,
    },
    include: { customer: true },
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
    return new Response("User not found", { status: 404 });
  }

  const tenantId = dbUser.memberships[0].tenantId;

  const json = await req.json();
  const result = invoiceSchema.safeParse(json);
  if (!result.success) {
    return Response.json(result.error.format(), { status: 400 });
  }

  const { customerId, status, lineItems, taxRateId, taxExempt }: InvoiceInput =
    result.data;

  const taxRate = taxRateId
    ? await prisma.taxRate.findUnique({ where: { id: Number(taxRateId) } })
    : null;

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return new Response("Tenant not found", { status: 404 });

  tenant.invoiceCounter = await getUpdatedTenantCounter(tenant);

  const details = await Promise.all(
    lineItems.map(
      async (
        item
      ): Promise<{
        productId: number;
        quantity: number;
        discountId: number | null;
        taxId: number | null;
        lineTotal: number;
      }> => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) throw new Error("Product not found");

        let lineTotal = product.price.toNumber() * item.quantity;

        if (item.discountId) {
          const discount = await prisma.discount.findUnique({
            where: { id: item.discountId },
          });
          if (discount) {
            lineTotal *= (100 - discount.discountValue.toNumber()) / 100;
          }
        }

        if (!taxExempt && taxRate) {
          lineTotal *= (100 + taxRate.rate.toNumber()) / 100;
        }

        return {
          productId: item.productId,
          quantity: item.quantity,
          discountId: item.discountId,
          taxId: taxRate ? taxRate.id : null,
          lineTotal: Number(lineTotal.toFixed(2)),
        };
      }
    )
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
          customer: { connect: { id: customerId } },
          tenant: { connect: { id: tenantId } },
          InvoiceDetail: { create: details },
        },
      });

      await prisma.tenant.update({
        where: { id: tenantId },
        data: { invoiceCounter: { increment: 1 } },
      });

      break;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        "code" in err &&
        (err as { code: string }).code === "P2002"
      ) {
        tenant.invoiceCounter++;
        attempt++;
      } else {
        console.error("Invoice creation failed", err);
        return new Response("Server error", { status: 500 });
      }
    }
  }

  if (!invoice) {
    return new Response("Failed to generate a unique invoice number", {
      status: 500,
    });
  }

  return Response.json(invoice, { status: 201 });
}

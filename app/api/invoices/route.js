import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createInvoiceSchema } from "@/lib/schemas/invoice";

// GET /api/invoices — Get all invoices for current user’s business
export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { business: true },
  });

  if (!dbUser?.businessId) {
    return new NextResponse("No associated business", { status: 404 });
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      businessId: dbUser.businessId,
      deleted: false,
    },
    include: {
      customer: true,
      LineItem: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(invoices);
}

export async function POST(req) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser?.businessId) {
    return new NextResponse("Business not found", { status: 404 });
  }

  const body = await req.json();
  const parsed = createInvoiceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error.format(), { status: 400 });
  }

  const { customerId, dueDate, lineItems } = parsed.data;

  // Generate next invoice number
  const count = await prisma.invoice.count({
    where: { businessId: dbUser.businessId },
  });
  const number = `INV-${String(count + 1).padStart(4, "0")}`;

  const amount = lineItems.reduce(
    (total, item) => total + item.quantity * item.rate,
    0
  );

  try {
    const invoice = await prisma.invoice.create({
      data: {
        number,
        amount,
        dueDate: new Date(dueDate),
        status: "DRAFT",
        businessId: dbUser.businessId,
        customerId,
        LineItem: {
          create: lineItems.map((item) => ({
            ...item,
            total: item.quantity * item.rate,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        },
      },
      include: {
        customer: true,
        LineItem: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create invoice:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

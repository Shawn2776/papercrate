import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      number: true,
      status: true,
      invoiceDate: true,
      dueDate: true,
      taxRateId: true,
      taxRatePercent: true,
      notes: true,
      customerId: true,
      businessId: true,
      LineItem: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
        },
      },
    },
  });

  return NextResponse.json(invoice);
}

export async function PUT(req, context) {
  const { params } = context;
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  console.log("Invoice update payload:", body);
  const { items, invoiceDate, dueDate, ...rest } = body;

  try {
    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        status: rest.status,
        notes: rest.notes,
        taxRate: rest.taxRateId ? { connect: { id: rest.taxRateId } } : undefined, // ✅ use the relation field
        taxRatePercent: rest.taxRatePercent ? Number(rest.taxRatePercent) : null,
        taxRatePercent: rest.taxRatePercent,

        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        customer: rest.customerId ? { connect: { id: rest.customerId } } : undefined,
        business: { connect: { id: rest.businessId } },
        LineItem: {
          deleteMany: {},
          create: items.map((item) => ({
            name: item.name,
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            rate: item.rate,
            total: item.quantity * item.rate,
            type: item.type?.toUpperCase() ?? "PRODUCT",
            updatedAt: new Date(),
          })),
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update invoice:", error);
    return NextResponse.json({ error: "Invoice update failed" }, { status: 500 });
  }
}

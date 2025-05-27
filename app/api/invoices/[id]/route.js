import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { LineItem: true },
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
  const { items, invoiceDate, dueDate, ...rest } = body;

  try {
    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        status: rest.status,
        notes: rest.notes,
        taxRateId: rest.taxRateId,
        invoiceDate: new Date(invoiceDate),
        dueDate: new Date(dueDate),
        customer: rest.customerId
          ? { connect: { id: rest.customerId } }
          : undefined,
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
            type: item.type,
            updatedAt: new Date(),
          })),
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update invoice:", error);
    return NextResponse.json(
      { error: "Invoice update failed" },
      { status: 500 }
    );
  }
}

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

export async function PUT(req, { params }) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const { items, ...rest } = body;

  const updated = await prisma.invoice.update({
    where: { id: params.id },
    data: {
      ...rest,
      LineItem: {
        deleteMany: {}, // remove old
        create: items.map((item) => ({
          ...item,
          total: item.quantity * item.rate,
          updatedAt: new Date(),
        })),
      },
    },
  });

  return NextResponse.json(updated);
}

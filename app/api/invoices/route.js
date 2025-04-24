// app/api/invoices/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    include: { business: true },
  });

  return NextResponse.json(invoices);
}

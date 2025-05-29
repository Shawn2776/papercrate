// app>api>invoices>[id]>token>route.js

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const invoiceId = params.id;

  // Make sure the invoice exists and belongs to this user’s business
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { business: true },
  });

  if (!invoice) return new NextResponse("Not found", { status: 404 });

  const token = randomBytes(32).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // expires in 7 days

  await prisma.invoiceAccessToken.create({
    data: {
      token,
      invoiceId,
      expiresAt,
    },
  });

  return NextResponse.json({
    accessUrl: `https://papercrate.io/invoice-access/${token}`,
  });
}

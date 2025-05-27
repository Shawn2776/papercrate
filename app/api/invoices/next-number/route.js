import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

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

  const lastInvoice = await prisma.invoice.findFirst({
    where: { businessId: dbUser.businessId },
    orderBy: { createdAt: "desc" },
  });

  let nextNumber = 1;
  if (lastInvoice?.number) {
    const match = lastInvoice.number.match(/INV-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  const invoiceNumber = `INV-${String(nextNumber).padStart(4, "0")}`;
  return NextResponse.json({ invoiceNumber });
}

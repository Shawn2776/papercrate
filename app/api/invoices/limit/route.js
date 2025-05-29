import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

const PLAN_LIMITS = {
  FREE: 10,
  BASIC: 50,
  PRO: Infinity,
};

export async function GET() {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { business: true },
  });

  if (!dbUser?.business) {
    return new NextResponse("Business not found", { status: 404 });
  }

  const plan = dbUser.business.plan || "FREE";
  const max = PLAN_LIMITS[plan] ?? 10;

  const invoiceCount = await prisma.invoice.count({
    where: {
      businessId: dbUser.business.id,
      deleted: false,
    },
  });

  return NextResponse.json({ allowed: invoiceCount < max });
}

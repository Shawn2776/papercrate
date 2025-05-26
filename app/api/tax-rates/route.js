import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser?.businessId)
    return new NextResponse("No business found", { status: 400 });

  const taxRates = await prisma.taxRate.findMany({
    where: { businessId: dbUser.businessId },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  });

  return NextResponse.json(taxRates);
}

export async function POST(req) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser?.businessId)
    return new NextResponse("No business found", { status: 400 });

  const body = await req.json();
  const { name, rate, isDefault } = body;

  if (!name || typeof rate !== "number") {
    return new NextResponse("Invalid data", { status: 400 });
  }

  if (isDefault) {
    // Unset existing default
    await prisma.taxRate.updateMany({
      where: { businessId: dbUser.businessId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const newRate = await prisma.taxRate.create({
    data: {
      name,
      rate,
      isDefault: !!isDefault,
      businessId: dbUser.businessId,
    },
  });

  return NextResponse.json(newRate);
}

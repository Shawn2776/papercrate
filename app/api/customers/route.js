import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser?.businessId) {
    return new NextResponse("No business associated", { status: 404 });
  }

  const customers = await prisma.customer.findMany({
    where: { businessId: dbUser.businessId, deleted: false },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(customers);
}

export async function POST(req) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser?.businessId) {
    return new NextResponse("No business found", { status: 404 });
  }

  const { name, email, phone, address } = await req.json();

  if (!name || !email || !phone || !address) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        businessId: dbUser.businessId,
      },
    });

    return NextResponse.json(customer, { status: 201 }); // ✅ moved inside
  } catch (error) {
    console.error("Error creating customer:", error);
    return new NextResponse("Error creating customer", { status: 500 });
  }
}

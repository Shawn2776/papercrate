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

  const products = await prisma.product.findMany({
    where: { businessId: dbUser.businessId, deleted: false },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
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

  const { name, description, price, unit, quantity } = await req.json();

  if (!name || !price || !unit || !quantity) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        unit,
        quantity,
        businessId: dbUser.businessId,
      },
    });

    return NextResponse.json(product, { status: 201 }); // ✅ moved inside
  } catch (error) {
    console.error("Error creating product:", error);
    return new NextResponse("Error creating product", { status: 500 });
  }
}

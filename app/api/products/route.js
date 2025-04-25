import { prisma } from "@/lib/db";
import { auditedCreate, auditedUpdate } from "@/lib/db/audited";
import { productSchema } from "@/lib/schemas/product";
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

  const body = await req.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, description, price, unit, quantity } = parsed.data;

  if (!name || !price || !unit || !quantity) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const product = await auditedCreate({
      user,
      model: "Product",
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

export async function PATCH(req) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser?.businessId) {
    return new NextResponse("No business found", { status: 404 });
  }

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return new NextResponse("Missing product ID", { status: 400 });
  }

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // 🔐 Check that product belongs to their business
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct || existingProduct.businessId !== dbUser.businessId) {
    return new NextResponse("Not allowed to update this product", {
      status: 403,
    });
  }

  try {
    const updated = await auditedUpdate({
      user,
      model: "product",
      where: { id },
      data: parsed.data,
      entityId: id,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return new NextResponse("Error updating product", { status: 500 });
  }
}

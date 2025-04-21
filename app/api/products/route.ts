import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/db/prisma";

import { z } from "zod";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";
import { productRequestSchema } from "@/lib/schemas/productRequestSchema";

// Nano ID generators
const generateSku = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
const generateBarcode = customAlphabet("0123456789", 12);

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  if (!dbUser || dbUser.memberships.length === 0) {
    return new NextResponse("User not found or has no memberships", {
      status: 403,
    });
  }

  const { searchParams } = new URL(req.url);
  const tenantIdFromQuery = searchParams.get("tenantId");
  const userTenantIds = dbUser.memberships.map((m) => m.tenantId);

  // ✅ Determine effective tenantId
  const tenantId = tenantIdFromQuery || userTenantIds[0];

  if (!tenantId || !userTenantIds.includes(tenantId)) {
    return new NextResponse("Unauthorized tenant access", { status: 403 });
  }

  const products = await prisma.product.findMany({
    where: { tenantId },
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
      sku: true,
      barcode: true,
    },
  });

  const parsedProducts = products.map((p) => ({
    ...p,
    price: parseFloat(p.price.toString()),
  }));

  return NextResponse.json(parsedProducts);
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  if (!dbUser) return new Response("User not found", { status: 404 });

  const body = await req.json();
  const parsed = productRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const {
    name,
    price,
    sku,
    barcode,
    qrCodeUrl,
    imageUrl,
    description,
    variant,
    category,
    tenantId: tenantFromClient,
  } = parsed.data;

  const tenantId =
    tenantFromClient || dbUser?.memberships?.[0]?.tenantId || null;

  if (!tenantId) return new Response("Missing tenant", { status: 400 });

  const generatedSku = sku || generateSku();
  const generatedBarcode = barcode || generateBarcode();
  const generatedQrUrl =
    qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?data=${generatedBarcode}&size=150x150`;

  const product = await prisma.product.create({
    data: {
      name,
      price: Number(price),
      sku: generatedSku,
      barcode: generatedBarcode,
      qrCodeUrl: generatedQrUrl,
      imageUrl,
      description,
      variant,
      tenantId,
      createdById: dbUser.id,
      updatedById: dbUser.id,
      category,
    },
  });

  await recordAuditLog({
    action: "CREATE",
    entityType: "Product",
    entityId: product.id.toString(),
    userId: dbUser.id,
    after: product,
  });

  return NextResponse.json(product, { status: 201 });
}

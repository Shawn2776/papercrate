import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/db/prisma";

import { z } from "zod";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";

// Nano ID generators
const generateSku = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
const generateBarcode = customAlphabet("0123456789", 12);

const productRequestSchema = z.object({
  name: z.string(),
  price: z.union([z.number(), z.string()]),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  imageUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  description: z.string().optional(),
  variant: z.string().optional(),
  category: z.string().optional(),
});

export async function GET() {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  const tenantId = dbUser?.memberships?.[0]?.tenantId;
  if (!tenantId) return new Response("Missing tenant", { status: 400 });

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

  const tenantId = dbUser?.memberships?.[0]?.tenantId;
  if (!tenantId) return new Response("Missing tenant", { status: 400 });

  const json = await req.json();
  const parsed = productRequestSchema.safeParse(json);
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
  } = parsed.data;

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

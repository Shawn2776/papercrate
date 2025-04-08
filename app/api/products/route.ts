import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";

// Nano ID generators
const generateSku = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
const generateBarcode = customAlphabet("0123456789", 12);

// Define the expected shape of product input
interface ProductRequestBody {
  name: string;
  price: number | string;
  sku?: string;
  barcode?: string;
  qrCodeUrl?: string;
  imageUrl?: string;
  description?: string;
  variant?: string;
  specs?: string; // optional JSON string
}

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

  const body = (await req.json()) as ProductRequestBody;

  const {
    name,
    price,
    sku,
    barcode,
    qrCodeUrl,
    imageUrl,
    description,
    variant,
    // specs,
  } = body;

  // const parsedSpecs = specs ? JSON.parse(specs) : undefined;

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
      // specs: parsedSpecs, // uncomment if specs column exists
    },
  });

  return NextResponse.json(product, { status: 201 });
}

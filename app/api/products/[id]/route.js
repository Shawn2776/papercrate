import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import getProductIdFromUrl from "@/lib/functions/url/getProductIdFromUrl";

export async function GET(req) {
  const id = getProductIdFromUrl(req);
  if (!id) return new NextResponse("Invalid product ID", { status: 400 });

  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  const product = await prisma.product.findFirst({
    where: {
      id,
      businessId: dbUser.businessId, // 🔐 ownership check
    },
  });

  if (!product) return new NextResponse("Not found", { status: 404 });

  return NextResponse.json(product);
}

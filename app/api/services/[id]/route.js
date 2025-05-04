import { prisma } from "@/lib/db";
import { getServiceIdFromUrl } from "@/lib/functions/url/getProductIdFromUrl";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  const id = getServiceIdFromUrl(req);
  if (!id) return new NextResponse("Invalid service ID", { status: 400 });

  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  const service = await prisma.service.findFirst({
    where: {
      id,
      businessId: dbUser.businessId, // 🔐 ownership check
    },
  });

  if (!service) return new NextResponse("Not found", { status: 404 });

  return NextResponse.json(service);
}

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
    return new NextResponse("No business found", { status: 404 });
  }

  const customers = await prisma.customer.findMany({
    where: { businessId: dbUser.businessId, deleted: false },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(customers);
}

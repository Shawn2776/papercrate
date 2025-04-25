// app/api/business/me/route.js
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { business: true },
  });

  if (!dbUser || !dbUser.business) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.json({
    id: dbUser.business.id,
    name: dbUser.business.name,
    email: dbUser.business.email,
  });
}

import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { businessSchema } from "@/lib/schemas/business";

export async function POST(req) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = businessSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email } = parsed.data;

  try {
    // ✅ Create new business
    const business = await prisma.business.create({
      data: {
        name,
        email,
      },
    });

    // ✅ Link business to existing user
    await prisma.user.update({
      where: { clerkId: user.id },
      data: { businessId: business.id },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (err) {
    console.error("Error creating business:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

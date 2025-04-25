// app/api/business/create/route.js
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { businessSchema } from "@/lib/schemas/business";
import { logAudit } from "@/lib/logging/logAudit";

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
    // Check for existing user with same email but different Clerk ID
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.clerkId !== user.id) {
      return NextResponse.json(
        { error: "Email already linked to a different account." },
        { status: 400 }
      );
    }

    // Create the business
    const business = await prisma.business.create({
      data: { name, email },
    });

    // Create or update the user and link to business
    await prisma.user.upsert({
      where: { clerkId: user.id },
      update: { businessId: business.id },
      create: {
        clerkId: user.id,
        email,
        name: user.firstName || "Unnamed",
        businessId: business.id,
      },
    });

    await logAudit({
      userId: user.id,
      email: user.primaryEmailAddress?.emailAddress || "unknown",
      action: "Created Business",
      entity: "Business",
      entityId: business.id,
      metadata: {
        name: business.name,
        email: business.email,
      },
    });

    return NextResponse.json({ businessId: business.id }, { status: 201 });
  } catch (err) {
    console.error("❌ Error creating business:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

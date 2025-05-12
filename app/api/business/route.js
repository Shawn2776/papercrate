// app/api/business/route.js
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auditedCreate, auditedUpdate, auditedUpsert } from "@/lib/db/audited";
import {
  fullBusinessSchema,
  initialBusinessSchema,
} from "@/lib/schemas/business";

export async function POST(req) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = initialBusinessSchema.safeParse(body);

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
    const business = await auditedCreate({
      user,
      model: "Business",
      data: {
        name,
        email,
      },
    });

    // Create or update the user and link to business
    await auditedUpsert({
      user,
      model: "user",
      where: { clerkId: user.id },
      update: { businessId: business.id },
      create: {
        clerkId: user.id,
        email,
        name: user.firstName || "Unnamed",
        businessId: business.id,
      },
    });

    return NextResponse.json({ businessId: business.id }, { status: 201 });
  } catch (err) {
    console.error("❌ Error creating business:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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

  const business = await prisma.business.findUnique({
    where: { id: dbUser.businessId },
  });

  if (!business) {
    return new NextResponse("Business not found", { status: 404 });
  }

  return NextResponse.json(business);
}

export async function PATCH(req) {
  try {
    // Authenticate the user
    const user = await currentUser();
    if (!user) {
      console.error("❌ No user authenticated");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the user's business
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser?.businessId) {
      console.error("❌ No business associated with user");
      return new NextResponse("No business associated", { status: 404 });
    }

    // Parse the request body
    const rawBody = await req.json();
    const parsed = fullBusinessSchema.safeParse(rawBody);

    if (!parsed.success) {
      console.error(
        "❌ Zod Validation Failed:",
        parsed.error.flatten().fieldErrors
      );
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData = parsed.data;

    // Update the business
    const updatedBusiness = await auditedUpdate({
      user,
      model: "Business",
      where: { id: dbUser.businessId },
      data: updateData,
    });

    console.log("🎯 Successfully updated business:", updatedBusiness);

    return NextResponse.json(updatedBusiness, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating business:", error);
    return new NextResponse(
      "Failed to update business. Please check your input and try again.",
      { status: 500 }
    );
  }
}

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
  const user = await currentUser();
  if (!user) {
    console.error("❌ No user authenticated");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  console.log("👤 dbUser:", dbUser);

  if (!dbUser?.businessId) {
    console.error("❌ No business associated with user");
    return new NextResponse("No business associated", { status: 404 });
  }

  const rawBody = await req.json();
  console.log("📥 Raw PATCH Body:", rawBody);

  // Clean empty strings → null
  const body = Object.fromEntries(
    Object.entries(rawBody).map(([key, value]) => [
      key,
      value === "" ? null : value,
    ])
  );

  console.log("🧹 Cleaned PATCH Body:", body);

  const parsed = fullBusinessSchema.safeParse(body);

  if (!parsed.success) {
    console.error(
      "❌ Zod Validation Failed:",
      parsed.error.flatten().fieldErrors
    );
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  console.log("✅ Passed Zod Validation:", parsed.data);

  // ✨ Enforce Required Fields Manually
  const requiredFields = [
    "addressLine1",
    "city",
    "state",
    "country",
    "postalCode",
  ];
  const missingFields = requiredFields.filter((field) => !parsed.data[field]);

  if (missingFields.length > 0) {
    console.error("❌ Missing required fields:", missingFields);
    return NextResponse.json(
      { error: `Missing required fields: ${missingFields.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const updatedBusiness = await auditedUpdate({
      user,
      model: "business",
      where: { id: dbUser.businessId },
      data: parsed.data,
    });

    console.log("🎯 Successfully updated business:", updatedBusiness);

    return NextResponse.json(updatedBusiness);
  } catch (error) {
    console.error("❌ Error updating business:", error);
    return new NextResponse(
      "Failed to update business. Please check your input and try again.",
      { status: 500 }
    );
  }
}

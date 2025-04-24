import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { prismaWithUser } from "@/prisma/withAudit";
import { defaultPermissionsByRole } from "@/lib/constants/permissions";
import { TenantSchema } from "@/lib/schemas";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) {
    return NextResponse.json(
      { error: "Clerk user is missing an email address." },
      { status: 400 }
    );
  }

  // 🔍 Ensure user exists
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        name: clerkUser.firstName || "New User",
      },
    });
  }

  const body = await req.json();
  const parsed = TenantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const prismaWithContext = prismaWithUser(dbUser.id);

  try {
    // 🛑 Prevent duplicate tenant if already exists for user + name
    const existing = await prisma.tenant.findFirst({
      where: {
        name: data.legalBusinessName,
        memberships: {
          some: { userId: dbUser.id },
        },
      },
    });

    if (existing) {
      return NextResponse.json({ tenantId: existing.id }, { status: 200 });
    }

    // 🏢 Create tenant and membership
    const tenant = await prismaWithContext.tenant.create({
      data: {
        name: data.legalBusinessName,
        email: data.businessEmail || null,
        website: data.onlineLink || null,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        state: data.businessState,
        zip: data.zip,
        isUspsValidated: false,
        memberships: {
          create: {
            userId: dbUser.id,
            role: "OWNER",
            permissions: defaultPermissionsByRole["OWNER"],
          },
        },
      },
    });

    // 🧾 Create business record
    await prismaWithContext.business.create({
      data: {
        businessType: data.businessType,
        businessCategory: data.businessCategory,
        businessSubcategory: data.businessSubcategory,
        legalBusinessName: data.legalBusinessName,
        doingBusinessAs: data.doingBusinessAs || null,
        ein: data.ein.trim(),
        businessEmail: data.businessEmail || null,
        businessState: data.businessState,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        zip: data.zip,
        city: data.city,
        isManualEntry: data.isManualEntry || false,
        onlineStatus: data.onlineStatus,
        onlineLink: data.onlineLink || null,
        tenantId: tenant.id,
        createdById: dbUser.id,
        updatedById: dbUser.id,
      },
    });

    // ✅ Return tenantId explicitly so Stripe checkout can use it
    return NextResponse.json({ tenantId: tenant.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("Error creating tenant/business:", err);
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await prismaWithContext.$disconnect();
  }
}

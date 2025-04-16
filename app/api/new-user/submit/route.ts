import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { prismaWithUser } from "@/prisma/withAudit";
import { TenantCreateSchema } from "@/lib/schemas/tenant";
import { defaultPermissionsByRole } from "@/lib/constants/permissions";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) {
    return NextResponse.json(
      { error: "User not found in DB" },
      { status: 404 }
    );
  }

  const body = await req.json();

  // Use user-aware prisma client with auditing
  const prismaWithContext = prismaWithUser(dbUser.id);
  const parsed = TenantCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  try {
    // Create Tenant
    const tenant = await prismaWithContext.tenant.create({
      data: {
        name: body.legalBusinessName,
        email: body.businessEmail || null,
        website: body.onlineLink || null,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2 || null,
        city: body.city,
        state: body.businessState,
        zip: body.zip,
        isUspsValidated: false, // or use a real flag if validated earlier
        memberships: {
          create: {
            userId: dbUser.id,
            role: "OWNER",
            permissions: defaultPermissionsByRole["OWNER"],
          },
        },
      },
    });

    // Create Business and associate to tenant
    const business = await prismaWithContext.business.create({
      data: {
        businessType: body.businessType,
        businessCategory: body.businessCategory,
        businessSubcategory: body.businessSubcategory,
        legalBusinessName: body.legalBusinessName,
        doingBusinessAs: body.doingBusinessAs || null,
        ein: body.ein,
        businessEmail: body.businessEmail || null,
        businessState: body.businessState,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2 || null,
        zip: body.zip,
        city: body.city,
        isManualEntry: body.isManualEntry || false,
        onlineStatus: body.onlineStatus,
        onlineLink: body.onlineLink || null,
        tenantId: tenant.id,
        createdById: dbUser.id,
        updatedById: dbUser.id,
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (err: unknown) {
    console.error("Error creating tenant/business:", err);

    const message =
      err instanceof Error ? err.message : "An unknown error occurred";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

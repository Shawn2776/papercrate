import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { defaultPermissionsByRole } from "@/lib/constants/permissions";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const tenant = await prisma.tenant.create({
      data: {
        name: `Dev Tenant (${new Date().toISOString().slice(0, 10)})`,
        plan: "FREE",
        memberships: {
          create: {
            userId,
            role: "OWNER",
            permissions: defaultPermissionsByRole["OWNER"],
          },
        },
      },
    });

    return NextResponse.json(tenant);
  } catch (err) {
    console.error("Error creating test tenant:", err);
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 }
    );
  }
}

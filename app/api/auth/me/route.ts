import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Permission } from "@prisma/client";

export async function GET() {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  if (!dbUser) return new NextResponse("User not found", { status: 404 });

  const tenantPermissions: Permission[] =
    dbUser.memberships?.flatMap((m) => {
      if (m.role === "OWNER") {
        return Object.values(Permission); // OWNER gets all permissions
      }
      return m.permissions || [];
    }) ?? [];

  return NextResponse.json({
    role: dbUser.role,
    permissions: Array.from(new Set(tenantPermissions)),
  });
}

// app/api/tenant/invoice-settings/route.ts
import { prismaWithUser } from "@/prisma/withAudit";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Permission } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

// Schema
const invoiceSettingsSchema = z.object({
  layout: z.enum(["classic", "modern", "minimal"]),
  primaryColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, {
      message: "Must be a valid 6-digit hex color starting with #",
    }),
  includeCustomerInfo: z.boolean(),
  includePaymentTerms: z.boolean(),
  includeDueDate: z.boolean(),
  includeNotes: z.boolean(),
  defaultNotes: z.string().optional(),
});

// POST: Save invoice settings
export async function POST(req: NextRequest): Promise<NextResponse> {
  const tenantId = req.headers.get("x-tenant-id");
  if (!tenantId) return new NextResponse("Missing tenant ID", { status: 400 });

  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    if (!dbUser) return new NextResponse("User not found", { status: 404 });

    const body = await req.json();
    const parsed = invoiceSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const prismaWithAudit = prismaWithUser(dbUser.id);
    const membership = await prismaWithAudit.tenantMembership.findFirst({
      where: { userId: dbUser.id, tenantId },
    });

    if (!membership) {
      return new NextResponse("Membership not found for this tenant", {
        status: 403,
      });
    }

    if (!membership.permissions.includes(Permission.MANAGE_BILLING)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const settings = await prismaWithAudit.invoiceSettings.upsert({
      where: { tenantId },
      update: parsed.data,
      create: {
        ...parsed.data,
        tenantId,
      },
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("POST /invoice-settings error", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// GET: Load invoice settings
export async function GET(req: NextRequest): Promise<NextResponse> {
  const tenantId = req.headers.get("x-tenant-id");
  if (!tenantId) return new NextResponse("Missing tenant ID", { status: 400 });

  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });
    if (!dbUser) return new NextResponse("User not found", { status: 404 });

    const prismaWithAudit = prismaWithUser(dbUser.id);
    const membership = await prismaWithAudit.tenantMembership.findFirst({
      where: { userId: dbUser.id, tenantId },
    });

    if (!membership) {
      return new NextResponse("Membership not found for this tenant", {
        status: 403,
      });
    }

    const settings = await prismaWithAudit.invoiceSettings.findUnique({
      where: { tenantId },
    });

    return NextResponse.json(settings || {});
  } catch (err) {
    console.error("GET /invoice-settings error", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

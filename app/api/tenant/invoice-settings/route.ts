import { prismaWithUser } from "@/prisma/withAudit";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validation
const invoiceSettingsSchema = z.object({
  layout: z.enum(["classic", "modern", "minimal"]),
  primaryColor: z.string().min(4),
  includeCustomerInfo: z.boolean(),
  includePaymentTerms: z.boolean(),
  includeDueDate: z.boolean(),
  includeNotes: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const data = await req.json();
    const parsed = invoiceSettingsSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const prisma = prismaWithUser(user.id);

    const membership = await prisma.tenantMembership.findFirst({
      where: { userId: user.id },
      include: { tenant: true },
    });

    if (!membership?.tenantId) {
      return new NextResponse("Tenant not found", { status: 404 });
    }

    const settings = await prisma.invoiceSettings.upsert({
      where: { tenantId: membership.tenantId },
      update: parsed.data,
      create: {
        ...parsed.data,
        tenantId: membership.tenantId,
      },
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("Invoice Settings Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const prisma = prismaWithUser(user.id);

    const membership = await prisma.tenantMembership.findFirst({
      where: { userId: user.id },
    });

    if (!membership?.tenantId) {
      return new NextResponse("Tenant not found", { status: 404 });
    }

    const settings = await prisma.invoiceSettings.findUnique({
      where: { tenantId: membership.tenantId },
    });

    return NextResponse.json(settings || {});
  } catch (err) {
    console.error("Invoice Settings Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

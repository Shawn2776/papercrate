import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";
import { customerSchema } from "@/lib/schemas";

export async function GET() {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  const tenantId = dbUser?.memberships?.[0]?.tenantId;
  if (!tenantId) return new Response("Missing tenant", { status: 400 });

  const customers = await prisma.customer.findMany({
    where: { tenantId },
  });

  return NextResponse.json(customers);
}

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  const tenantId = dbUser?.memberships?.[0]?.tenantId;
  if (!tenantId) return new NextResponse("Missing tenant", { status: 400 });

  const body = await req.json();
  const parsed = customerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  // Auto-fill empty strings to avoid nulls (optional, if no @default in Prisma)
  const safeData = {
    ...parsed.data,
    billingAddressLine1: parsed.data.billingAddressLine1 ?? "",
    billingAddressLine2: parsed.data.billingAddressLine2 ?? "",
    billingCity: parsed.data.billingCity ?? "",
    billingState: parsed.data.billingState ?? "",
    billingZip: parsed.data.billingZip ?? "",
    shippingAddressLine1: parsed.data.shippingAddressLine1 ?? "",
    shippingAddressLine2: parsed.data.shippingAddressLine2 ?? "",
    shippingCity: parsed.data.shippingCity ?? "",
    shippingState: parsed.data.shippingState ?? "",
    shippingZip: parsed.data.shippingZip ?? "",
    notes: parsed.data.notes ?? "",
  };

  const customer = await prisma.customer.create({
    data: {
      ...safeData,
      tenantId,
      createdById: dbUser.id,
      updatedById: dbUser.id,
    },
  });

  const fullCustomer = await prisma.customer.findUnique({
    where: { id: customer.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      billingAddressLine1: true,
      billingAddressLine2: true,
      billingCity: true,
      billingState: true,
      billingZip: true,
      shippingAddressLine1: true,
      shippingAddressLine2: true,
      shippingCity: true,
      shippingState: true,
      shippingZip: true,
      notes: true,
      tenantId: true,
      deleted: true,
    },
  });

  await recordAuditLog({
    action: "CREATE",
    entityType: "Customer",
    entityId: customer.id.toString(),
    userId: dbUser.id,
    after: customer,
  });

  return NextResponse.json(fullCustomer, { status: 201 });
}

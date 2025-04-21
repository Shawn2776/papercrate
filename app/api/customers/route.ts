import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";
import { customerSchema } from "@/lib/schemas";
import { NormalizedCustomer } from "@/lib/types";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  if (!dbUser || dbUser.memberships.length === 0) {
    return new NextResponse("User not found or has no memberships", {
      status: 403,
    });
  }

  const { searchParams } = new URL(req.url);
  const tenantIdFromQuery = searchParams.get("tenantId");
  const userTenantIds = dbUser.memberships.map((m) => m.tenantId);

  const tenantId = tenantIdFromQuery || userTenantIds[0];

  if (!tenantId || !userTenantIds.includes(tenantId)) {
    return new NextResponse("Unauthorized tenant access", { status: 403 });
  }

  const customers = await prisma.customer.findMany({
    where: { tenantId },
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
      createdAt: true,
      updatedAt: true,
      createdById: true,
      updatedById: true,
    },
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

  if (!dbUser) return new NextResponse("User not found", { status: 404 });

  const body = await req.json();
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const tenantId = body.tenantId || dbUser?.memberships?.[0]?.tenantId || null;

  if (!tenantId) return new NextResponse("Missing tenant", { status: 400 });

  const customer = await prisma.customer.create({
    data: {
      ...parsed.data,
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
      createdAt: true,
      updatedAt: true,
      createdById: true,
      updatedById: true,
    },
  });

  if (!fullCustomer) {
    return new NextResponse("Customer not found after creation", {
      status: 500,
    });
  }

  await recordAuditLog({
    action: "CREATE",
    entityType: "Customer",
    entityId: customer.id.toString(),
    userId: dbUser.id,
    after: fullCustomer,
  });

  return NextResponse.json(fullCustomer, { status: 201 });
}

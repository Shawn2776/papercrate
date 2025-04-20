import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";
import { customerSchema } from "@/lib/schemas";
import { NormalizedCustomer } from "@/lib/types";

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

  const tenantId = dbUser?.memberships?.[0]?.tenantId;
  if (!tenantId) return new NextResponse("Missing tenant", { status: 400 });

  const body = await req.json();
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

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

  return NextResponse.json(
    {
      ...fullCustomer,
      billingAddressLine1: fullCustomer.billingAddressLine1 ?? "",
      billingAddressLine2: fullCustomer.billingAddressLine2 ?? "",
      billingCity: fullCustomer.billingCity ?? "",
      billingState: fullCustomer.billingState ?? "",
      billingZip: fullCustomer.billingZip ?? "",
      shippingAddressLine1: fullCustomer.shippingAddressLine1 ?? "",
      shippingAddressLine2: fullCustomer.shippingAddressLine2 ?? "",
      shippingCity: fullCustomer.shippingCity ?? "",
      shippingState: fullCustomer.shippingState ?? "",
      shippingZip: fullCustomer.shippingZip ?? "",
      notes: fullCustomer.notes ?? "",
    },
    { status: 201 }
  );
}

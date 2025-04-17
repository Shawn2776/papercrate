import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { customerSchema } from "@/lib/schemas"; // ✅ import the centralized Zod schema
import { prisma } from "@/lib/prisma";

export async function GET() {
  console.log("📥 Customer API hit");
  const user = await currentUser();
  if (!user) {
    console.log("❌ No current user");
    return new Response("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  console.log("👤 DB user found:", dbUser?.email);

  const tenantId = dbUser?.memberships?.[0]?.tenantId;
  console.log("🏷️ Tenant ID for fetch:", tenantId);
  if (!tenantId) return new Response("Missing tenant", { status: 400 });

  const customers = await prisma.customer.findMany({
    where: {
      tenantId, // ← this will scope to the current tenant only
    },
  });

  console.log(
    "🧾 Customers returned:",
    customers.map((c) => ({
      id: c.id,
      name: c.name,
      tenantId: c.tenantId,
    }))
  );

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

  const { name, email, phone, address } = parsed.data;

  const customer = await prisma.customer.create({
    data: {
      name,
      email,
      phone,
      address,
      tenantId,
      createdById: dbUser.id,
      updatedById: dbUser.id,
    },
  });

  return NextResponse.json(
    { id: customer.id, name: customer.name },
    { status: 201 }
  );
}

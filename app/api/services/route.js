import { prisma } from "@/lib/db";
import { auditedCreate, auditedUpdate } from "@/lib/db/audited";
import { serviceSchema } from "@/lib/schemas/service";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser?.businessId) {
    return new NextResponse("No business associated", { status: 404 });
  }

  const services = await prisma.service.findMany({
    where: { businessId: dbUser.businessId, deleted: false },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(services);
}

export async function POST(req) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser?.businessId) {
    return new NextResponse("No business found", { status: 404 });
  }

  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, description, rate, unit } = parsed.data;

  if (!name || !description || !unit || !rate) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const service = await auditedCreate({
      user,
      model: "Service",
      data: {
        name,
        description,
        rate,
        unit,
        businessId: dbUser.businessId,
      },
    });

    return NextResponse.json(service, { status: 201 }); // ✅ moved inside
  } catch (error) {
    console.error("Error creating service:", error);
    return new NextResponse("Error creating service", { status: 500 });
  }
}

export async function PATCH(req) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser?.businessId) {
    return new NextResponse("No business found", { status: 404 });
  }

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return new NextResponse("Missing service ID", { status: 400 });
  }

  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // 🔐 Check that service belongs to their business
  const existingService = await prisma.service.findUnique({
    where: { id },
  });

  if (!existingService || existingService.businessId !== dbUser.businessId) {
    return new NextResponse("Not allowed to update this service", {
      status: 403,
    });
  }

  try {
    const updated = await auditedUpdate({
      user,
      model: "service",
      where: { id },
      data: parsed.data,
      entityId: id,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating service:", error);
    return new NextResponse("Error updating service", { status: 500 });
  }
}

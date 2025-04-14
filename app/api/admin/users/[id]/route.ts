import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromUrl } from "@/lib/functions/getUserIdFromUrl";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const id = getUserIdFromUrl(req);
  if (!id) return new Response("Missing user ID", { status: 400 });

  try {
    const fullUser = await prisma.user.findUnique({
      where: { id },
      include: {
        memberships: { include: { tenant: true } },
        createdInvoices: true,
        updatedInvoices: true,
        createdProducts: true,
        updatedProducts: true,
        auditLogs: true,
      },
    });

    if (!fullUser) return new Response("User not found", { status: 404 });

    const counts = {
      memberships: fullUser.memberships.length,
      createdInvoices: fullUser.createdInvoices.length,
      updatedInvoices: fullUser.updatedInvoices.length,
      createdProducts: fullUser.createdProducts.length,
      updatedProducts: fullUser.updatedProducts.length,
      auditLogs: fullUser.auditLogs.length,
    };

    return Response.json({ ...fullUser, counts });
  } catch (err) {
    console.error("Error fetching user:", err);
    return new Response("Failed to fetch user", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const id = getUserIdFromUrl(req);
  if (!id) return new Response("Missing user ID", { status: 400 });

  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) return new Response("User not found", { status: 404 });

    await prisma.$transaction([
      prisma.user.delete({ where: { id } }),
      prisma.auditLog.create({
        data: {
          action: "DELETE",
          entityType: "User",
          entityId: id,
          userId: user.id,
          before: existingUser,
          after: {},
        },
      }),
    ]);

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete failed:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser || clerkUser.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const id = getUserIdFromUrl(req);
  if (!id) return new Response("Missing user ID", { status: 400 });

  const body = await req.json();

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });
  if (!dbUser) return new Response("Admin user not found", { status: 404 });

  try {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return new Response("User not found", { status: 404 });

    const updated = await prisma.user.update({
      where: { id },
      data: body,
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entityType: "User",
        entityId: id,
        userId: dbUser.id,
        before: existing,
        after: updated,
      },
    });

    return Response.json(updated);
  } catch (err) {
    console.error("Update failed:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// app/api/admin/users/[id]/soft-delete/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserIdFromUrl } from "@/lib/functions/getUserIdFromUrl";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function PATCH(req: NextRequest) {
  const authUser = await currentUser();
  if (!authUser || authUser.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const id = getUserIdFromUrl(req);
  if (!id) return new Response("Missing user ID", { status: 400 });

  try {
    const { userId } = await auth(); // Acting admin (optional for logging)

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return new Response("User not found", { status: 404 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { deleted: true },
      }),
      prisma.auditLog.create({
        data: {
          action: "SOFT_DELETE",
          entityType: "User",
          entityId: id,
          userId: userId ?? "SYSTEM",
          before: existingUser,
          after: { ...existingUser, deleted: true },
        },
      }),
    ]);

    return Response.json({ success: true });
  } catch (err) {
    console.error("Soft delete failed:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

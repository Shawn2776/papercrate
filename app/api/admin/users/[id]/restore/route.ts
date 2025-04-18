// app/api/admin/users/[id]/restore/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { getUserIdFromUrl } from "@/lib/url/getUserIdFromUrl";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function PATCH(req: NextRequest) {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const id = getUserIdFromUrl(req);
  if (!id) return new Response("Missing user ID", { status: 400 });

  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return new Response("User not found", { status: 404 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { deleted: false },
      }),
      prisma.auditLog.create({
        data: {
          action: "RESTORE",
          entityType: "User",
          entityId: id,
          userId: user.id,
          before: existingUser,
          after: { ...existingUser, deleted: false },
        },
      }),
    ]);

    return Response.json({ success: true });
  } catch (err) {
    console.error("Restore failed:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

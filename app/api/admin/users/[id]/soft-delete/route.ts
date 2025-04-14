// app/api/admin/users/[id]/soft-delete/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"; // optional, if using Clerk

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authUser = await currentUser();
  if (!authUser || authUser.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  try {
    const { id } = params;
    const { userId } = await auth(); // acting admin (optional)

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

// app/api/admin/users/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export async function GET() {
  const user = await currentUser();
  if (!user || user.id !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return Response.json(users);
}

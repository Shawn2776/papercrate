import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { business: true },
  });

  if (!dbUser?.business) {
    return new Response("Business not found", { status: 404 });
  }

  return Response.json(dbUser.business);
}

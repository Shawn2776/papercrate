import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      memberships: {
        include: {
          tenant: true,
        },
      },
    },
  });

  if (!dbUser || !dbUser.memberships.length) {
    return new Response("No tenants found", { status: 404 });
  }

  const tenants = dbUser.memberships.map((m) => ({
    id: m.tenant.id,
    name: m.tenant.name,
  }));

  return Response.json(tenants);
}

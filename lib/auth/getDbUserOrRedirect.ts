import { auth } from "@clerk/nextjs/server";
import { prisma } from "../db/prisma";
import type { User, TenantMembership } from "@prisma/client";

export async function getDbUserOrRedirect(): Promise<
  User & { memberships: TenantMembership[] }
> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("UNAUTHORIZED");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
    include: { memberships: true },
  });

  if (!dbUser) {
    throw new Error("USER_NOT_FOUND");
  }

  return dbUser;
}

// lib/auth/requireTenant.ts
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export async function requireTenant(userId: string): Promise<string> {
  const membership = await prisma.tenantMembership.findFirst({
    where: { userId },
  });

  if (!membership) redirect("/new-user/1");
  return membership.tenantId;
}

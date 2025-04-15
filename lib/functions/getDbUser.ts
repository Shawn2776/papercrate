// lib/getDbUser.ts

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export async function getDbUserOrThrow() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Not authenticated");

  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!dbUser) throw new Error("User not found");

  return dbUser;
}

export async function getDbUserOrRedirect() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!dbUser) redirect("/sign-in");

  const existingMembership = await prisma.tenantMembership.findFirst({
    where: { userId: dbUser.id },
  });

  if (existingMembership) redirect("/dashboard");

  return dbUser;
}

export async function getDbUserOrRedirectTo({
  ifMissing = "/sign-in",
  ifHasMembership = "/dashboard",
}: {
  ifMissing?: string;
  ifHasMembership?: string;
} = {}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect(ifMissing);

  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!dbUser) redirect(ifMissing);

  const existingMembership = await prisma.tenantMembership.findFirst({
    where: { userId: dbUser.id },
  });

  if (existingMembership) redirect(ifHasMembership);

  return dbUser;
}

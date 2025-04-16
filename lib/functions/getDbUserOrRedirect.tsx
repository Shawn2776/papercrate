import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "../prisma";

// lib/getDbUser.ts
export async function getDbUserOrRedirect() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!dbUser) redirect("/new-user/1");

  return dbUser;
}

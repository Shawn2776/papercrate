import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "../prisma";

// lib/getDbUser.ts
export async function getDbUserOrRedirect() {
  console.log("in getDbUserOrRedirect");
  const { userId: clerkId } = await auth();
  console.log("clerkId", clerkId);
  if (!clerkId) redirect("/sign-in");
  console.log("clerkid -- found");
  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  console.log("dbUSer: ", dbUser);
  if (!dbUser) redirect("/new-user/1");
  console.log("dbUSer found");

  return dbUser;
}

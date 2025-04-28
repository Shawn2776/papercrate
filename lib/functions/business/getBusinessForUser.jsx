// /lib/functions/getBusinessForUser.js

import { prisma } from "@/lib/db";

export async function getBusinessForUser(clerkId) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { business: true },
  });

  if (!user || !user.business) {
    throw new Error("Business not found for user");
  }

  return user.business;
}

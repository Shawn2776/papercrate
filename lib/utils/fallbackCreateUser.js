import { prisma } from "@/lib/db";

/**
 * Ensures a user with the given Clerk ID exists in the database,
 * along with a default editable business.
 */
export async function fallbackCreateUser(clerkUser) {
  const email =
    clerkUser?.emailAddresses?.[0]?.emailAddress ?? "unknown@example.com";
  const name = clerkUser?.firstName || clerkUser?.username || "Unnamed";

  return await prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email,
      name,
      business: {
        create: {
          name: "My Business",
          email,
        },
      },
    },
  });
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StepTwoCategory from "@/components/forms/new-user/StepTwoCategory";

export default async function StepTwoPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!dbUser) redirect("/sign-in");

  const existingMembership = await prisma.tenantMembership.findFirst({
    where: { userId: dbUser.id },
  });

  if (existingMembership) redirect("/dashboard");

  return (
    <main className="min-h-screen">
      <StepTwoCategory />
    </main>
  );
}

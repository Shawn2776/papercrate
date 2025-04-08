// app/(secure)/dashboard/new-user/[step]/page.tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import StepOneBusinessType from "@/components/forms/new-user/StepOneBusinessType";
import StepTwoCategory from "@/components/forms/new-user/StepTwoCategory";
import StepThreeSubcategory from "@/components/forms/new-user/StepThreeSubcategory";
import StepFourBusinessDetails from "@/components/forms/new-user/StepFourBusinessDetails";
import StepFiveReviewSubmit from "@/components/forms/new-user/StepFiveReviewSubmit";

type Props = {
  params: {
    step: string;
  };
};

export default async function StepPage({ params }: Props) {
  const stepNumber = parseInt(params.step, 10);
  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 5) notFound();

  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!dbUser) redirect("/sign-in");

  const membership = await prisma.tenantMembership.findFirst({
    where: { userId: dbUser.id },
  });

  if (membership) redirect("/dashboard");

  const steps = {
    1: <StepOneBusinessType />,
    2: <StepTwoCategory />,
    3: <StepThreeSubcategory />,
    4: <StepFourBusinessDetails />,
    5: <StepFiveReviewSubmit />,
  };

  return (
    <main className="min-h-screen">
      {steps[stepNumber as keyof typeof steps] ?? (
        <p className="text-red-500 text-center p-4">Invalid step</p>
      )}
    </main>
  );
}

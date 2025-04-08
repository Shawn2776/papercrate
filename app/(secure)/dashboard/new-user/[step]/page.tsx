import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

import StepOneBusinessType from "@/components/forms/new-user/StepOneBusinessType";
import StepTwoCategory from "@/components/forms/new-user/StepTwoCategory";
import StepThreeSubcategory from "@/components/forms/new-user/StepThreeSubcategory";
import StepFourBusinessDetails from "@/components/forms/new-user/StepFourBusinessDetails";
import StepFiveReviewSubmit from "@/components/forms/new-user/StepFiveReviewSubmit";

export interface PageProps {
  params: {
    step: string;
  };
}

export default async function StepPage({ params }: PageProps) {
  const step = Number(params.step);

  if (!step || step < 1 || step > 5) {
    notFound();
  }

  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const membership = await prisma.tenantMembership.findFirst({
    where: { userId },
  });

  if (membership) return redirect("/dashboard");

  const components = {
    1: <StepOneBusinessType />,
    2: <StepTwoCategory />,
    3: <StepThreeSubcategory />,
    4: <StepFourBusinessDetails />,
    5: <StepFiveReviewSubmit />,
  };

  return (
    <main className="min-h-screen">
      {components[step as keyof typeof components] ?? (
        <p className="p-4 text-red-600 text-center">Step not found.</p>
      )}
    </main>
  );
}

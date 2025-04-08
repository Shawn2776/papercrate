import StepFiveReviewSubmit from "@/components/forms/new-user/StepFiveReviewSubmit";
import StepFourBusinessDetails from "@/components/forms/new-user/StepFourBusinessDetails";
import StepOneBusinessType from "@/components/forms/new-user/StepOneBusinessType";
import StepThreeSubcategory from "@/components/forms/new-user/StepThreeSubcategory";
import StepTwoCategory from "@/components/forms/new-user/StepTwoCategory";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";

interface PageProps {
  params: {
    step: string;
  };
}

export default async function StepPage({ params }: PageProps) {
  const stepNumber = parseInt(params.step, 10);

  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 5) {
    notFound(); // optional: handle invalid steps
  }

  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const existingMembership = await prisma.tenantMembership.findFirst({
    where: { userId },
  });

  if (existingMembership) {
    return redirect("/dashboard"); // or your actual app home
  }

  const step = parseInt(params.step);

  if (isNaN(step) || step < 1 || step > 5) {
    return redirect("/dashboard/new-user/1");
  }

  const stepComponents = {
    1: <StepOneBusinessType />,
    2: <StepTwoCategory />,
    3: <StepThreeSubcategory />,
    4: <StepFourBusinessDetails />,
    5: <StepFiveReviewSubmit />,
  };

  return (
    <main className="min-h-screen">
      {stepComponents[step as keyof typeof stepComponents] || (
        <p className="text-center p-8 text-red-600">Unknown step</p>
      )}
    </main>
  );
}

import StepOneBusinessType from "@/components/forms/new-user/StepOneBusinessType";
import StepTwoCategory from "@/components/forms/new-user/StepTwoCategory";
import StepThreeSubcategory from "@/components/forms/new-user/StepThreeSubcategory";
import StepFourBusinessDetails from "@/components/forms/new-user/StepFourBusinessDetails";
import StepFiveReviewSubmit from "@/components/forms/new-user/StepFiveReviewSubmit";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";

type StepPageProps = {
  params: {
    step: string;
  };
};

export default async function StepPage({ params }: StepPageProps) {
  const step = parseInt(params.step, 10);

  if (isNaN(step) || step < 1 || step > 5) {
    notFound(); // invalid step
  }

  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return redirect("/sign-in"); // or throw
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!dbUser) {
    return redirect("/sign-in"); // or throw
  }

  const existingMembership = await prisma.tenantMembership.findFirst({
    where: { userId: dbUser.id },
  });

  console.log("existingMembership:", existingMembership);

  if (existingMembership) redirect("/dashboard");

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
        <p className="text-center text-red-600 p-6">Unknown step</p>
      )}
    </main>
  );
}

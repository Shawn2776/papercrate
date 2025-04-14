import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StepFiveReviewSubmit from "@/components/forms/new-user/StepFiveReviewSubmit";
import { getDbUserOrRedirect } from "@/lib/functions/getDbUserOrRedirect";

export default async function StepFivePage() {
  await getDbUserOrRedirect();

  return (
    <main className="min-h-screen">
      <StepFiveReviewSubmit />
    </main>
  );
}

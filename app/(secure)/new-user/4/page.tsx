import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StepFourBusinessDetails from "@/components/forms/new-user/StepFourBusinessDetails";
import { getDbUserOrRedirect } from "@/lib/functions/getDbUserOrRedirect";

export default async function StepFourPage() {
  getDbUserOrRedirect();

  return (
    <main className="min-h-screen">
      <StepFourBusinessDetails />
    </main>
  );
}

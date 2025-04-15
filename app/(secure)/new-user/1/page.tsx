import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StepOneBusinessType from "@/components/forms/new-user/StepOneBusinessType";
import { getDbUserOrRedirect } from "@/lib/functions/getDbUserOrRedirect";

export default async function StepOnePage() {
  await getDbUserOrRedirect();

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-3xl mx-auto">
        <StepOneBusinessType />
      </div>
    </main>
  );
}

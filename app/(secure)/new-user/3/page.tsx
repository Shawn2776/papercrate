import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StepThreeSubcategory from "@/components/forms/new-user/StepThreeSubcategory";
import { getDbUserOrRedirect } from "@/lib/functions/getDbUserOrRedirect";

export default async function StepThreePage() {
  await getDbUserOrRedirect();

  return (
    <main className="min-h-screen">
      <StepThreeSubcategory />
    </main>
  );
}

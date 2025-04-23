// app/new-user/1/page.tsx
"use client";

import StepOneBusinessType from "@/components/forms/new-user/StepOneBusinessType";
import { useSearchParams } from "next/navigation";

export default function StepOnePage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-3xl mx-auto">
        <StepOneBusinessType name={name} email={email} />
      </div>
    </main>
  );
}

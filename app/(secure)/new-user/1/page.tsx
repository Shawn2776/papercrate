// app/new-user/1/page.tsx
"use client";

import StepOneBusinessType from "@/components/forms/new-user/StepOneBusinessType";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setFormData } from "@/lib/redux/slices/onboardingSlice";

export default function StepOnePage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const cached = localStorage.getItem("onboarding_prefill");
      if (cached) {
        const parsed = JSON.parse(cached);
        dispatch(setFormData(parsed));
        console.log("[Prefill restored from localStorage]", parsed);
      }
    } catch (err) {
      console.error("Failed to restore onboarding prefill", err);
    }
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-3xl mx-auto">
        <StepOneBusinessType />
      </div>
    </main>
  );
}

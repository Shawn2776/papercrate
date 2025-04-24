// app/new-user/1/page.tsx
"use client";

import StepOneBusinessType from "@/components/forms/new-user/StepOneBusinessType";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setFormData } from "@/lib/redux/slices/onboardingSlice";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function StepOnePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useUser();
  const formData = useAppSelector((state) => state.onboarding.formData);

  // Restore from localStorage
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

  // Restore from Clerk (typed field update only)
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      dispatch(
        setFormData({ businessEmail: user.primaryEmailAddress.emailAddress })
      );
      console.log(
        "[Clerk email added to onboarding as businessEmail]",
        user.primaryEmailAddress.emailAddress
      );
    }
  }, [user, dispatch]);

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-3xl mx-auto">
        <StepOneBusinessType />
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setStep, resetOnboarding } from "@/lib/redux/slices/onboardingSlice";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import FormHeader from "../FormHeader";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";

export default function StepFiveReviewSubmit() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const step = useAppSelector((state) => state.onboarding.step);
  const data = useAppSelector((state) => state.onboarding.formData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    dispatch(setStep(step - 1));
    router.push(`/dashboard/new-user/${step - 1}`);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/new-user/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Something went wrong.");
      }

      dispatch(resetOnboarding());
      router.push("/dashboard/new-user/success");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FormHeader
        h2="Review & Submit"
        p="Review your business details before continuing"
      />
      <Card className="rounded-none shadow-lg p-2 mb-0 gap-0">
        <CardContent className="w-full p-0 mb-0 space-y-4">
          <div className="space-y-2 text-sm">
            <p>
              <strong>Business Type:</strong> {data.businessType}
            </p>
            <p>
              <strong>Category:</strong> {data.businessCategory}
            </p>
            <p>
              <strong>Subcategory:</strong> {data.businessSubcategory}
            </p>
            <p>
              <strong>Legal Name:</strong> {data.legalBusinessName}
            </p>
            <p>
              <strong>Doing Business As:</strong> {data.doingBusinessAs || "—"}
            </p>
            <p>
              <strong>EIN:</strong> {data.ein}
            </p>
            <p>
              <strong>Business Email:</strong> {data.businessEmail || "—"}
            </p>
            <p>
              <strong>Address:</strong> {data.addressLine1} {data.addressLine2}
            </p>
            <p>
              <strong>City:</strong> {data.city}
            </p>
            <p>
              <strong>State:</strong> {data.businessState}
            </p>
            <p>
              <strong>ZIP:</strong> {data.zip}
            </p>
            <p>
              <strong>Online Status:</strong> {data.onlineStatus}
            </p>
            {data.onlineLink && (
              <p>
                <strong>Online Link:</strong> {data.onlineLink}
              </p>
            )}
          </div>

          {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}

          <div className="flex mt-6">
            <Button
              onClick={handleBack}
              className="w-1/2 rounded-none border-r"
            >
              <MdOutlineKeyboardReturn className="mr-1" /> Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-1/2 rounded-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

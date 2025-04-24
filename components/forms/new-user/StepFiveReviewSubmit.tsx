// app/new-user/5/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setFormData,
  setStep,
  resetOnboarding,
} from "@/lib/redux/slices/onboardingSlice";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import FormHeader from "../FormHeader";

import { states } from "@/components/states/States";
import { businessCategories } from "../new-user/StepTwoCategory";
import { subcategories as allSubcategories } from "../new-user/StepThreeSubcategory";

export default function StepFiveReviewSubmit() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const step = useAppSelector((state) => state.onboarding.step);
  const formData = useAppSelector((state) => state.onboarding.formData);

  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState({ ...formData });
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (localData.businessCategory) {
      setSubcategories(allSubcategories[localData.businessCategory] || []);
    } else {
      setSubcategories([]);
    }
  }, [localData.businessCategory]);

  const handleChange = (
    field: keyof typeof localData,
    value: string | boolean
  ) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    dispatch(setStep(step - 1));
    router.push(`/new-user/4`);
  };

  const handleCancel = () => {
    setLocalData({ ...formData });
    setEditMode(false);
  };

  const handleSave = () => {
    dispatch(setFormData(localData));
    setEditMode(false);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/new-user/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        console.error("Submission failed");
        return;
      }

      const { tenantId } = await res.json();
      dispatch(setFormData({ tenantId }));

      const plan = formData.plan || "free";
      if (plan !== "free") {
        const stripeRes = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,
            billingCycle: formData.billingCycle || "monthly",
          }),
        });

        const stripeData = await stripeRes.json();
        if (stripeRes.ok && stripeData.url) {
          window.location.href = stripeData.url;
          return;
        }

        console.error("Stripe error:", stripeData);
        return;
      }

      dispatch(resetOnboarding());
      router.push("/new-user/success");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (label: string, field: keyof typeof localData) => (
    <div className="grid grid-cols-2 items-center gap-4">
      <Label className="font-semibold text-right pr-2">{label}</Label>
      {editMode ? (
        <Input
          value={
            typeof localData[field] === "string" ? localData[field] || "" : ""
          }
          onChange={(e) => handleChange(field, e.target.value)}
        />
      ) : (
        <p>{localData[field] || "—"}</p>
      )}
    </div>
  );

  return (
    <>
      <FormHeader h2="Review & Submit" p="Review your business details." />
      <Card className="rounded-none shadow-lg p-6">
        <div className="flex justify-end mb-4">
          {editMode ? (
            <Button variant="outline" onClick={handleCancel} className="mr-2">
              Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )}
        </div>
        <CardContent className="grid gap-4">
          {renderField("Legal Name", "legalBusinessName")}
          {renderField("Doing Business As", "doingBusinessAs")}
          {renderField("EIN", "ein")}
          {renderField("Business Email", "businessEmail")}
          {renderField("Address Line 1", "addressLine1")}
          {renderField("Address Line 2", "addressLine2")}
          {renderField("City", "city")}
          {renderField("State", "businessState")}
          {renderField("ZIP", "zip")}

          <div className="grid grid-cols-2 items-center gap-4">
            <Label className="text-right font-semibold pr-2">
              Billing Cycle
            </Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="billingCycle"
                  value="monthly"
                  checked={localData.billingCycle === "monthly"}
                  onChange={() => handleChange("billingCycle", "monthly")}
                />
                Monthly
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="billingCycle"
                  value="annual"
                  checked={localData.billingCycle === "annual"}
                  onChange={() => handleChange("billingCycle", "annual")}
                />
                Annual (Save 20%)
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button onClick={handleBack} className="w-1/2 rounded-none">
              <MdOutlineKeyboardReturn className="mr-1" /> Back
            </Button>
            {editMode ? (
              <Button onClick={handleSave} className="w-1/2 rounded-none">
                Save
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="w-1/2 rounded-none"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

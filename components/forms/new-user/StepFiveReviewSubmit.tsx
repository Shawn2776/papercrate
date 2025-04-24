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
    const res = await fetch("/api/new-user/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      console.error("Submission failed");
      return;
    }

    const data = await res.json();
    const plan = formData.plan || "free";

    if (plan !== "free") {
      const stripeRes = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
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
          {editMode ? (
            <div className="grid grid-cols-2 items-center gap-4">
              <Label className="font-semibold text-right pr-2">
                Business Type
              </Label>
              <select
                value={localData.businessType || ""}
                onChange={(e) => handleChange("businessType", e.target.value)}
                className="border rounded p-2"
              >
                <option value="">Select one</option>
                <option value="sole-proprietorship">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
                <option value="unincorporated">Unincorporated</option>
                <option value="individual">Individual</option>
              </select>
            </div>
          ) : (
            renderField("Business Type", "businessType")
          )}

          {editMode ? (
            <div className="grid grid-cols-2 items-center gap-4">
              <Label className="font-semibold text-right pr-2">Category</Label>
              <select
                value={localData.businessCategory || ""}
                onChange={(e) =>
                  handleChange("businessCategory", e.target.value)
                }
                className="border rounded p-2"
              >
                <option value="">Select one</option>
                {Object.entries(businessCategories).map(([key, { name }]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            renderField("Category", "businessCategory")
          )}

          {editMode && subcategories.length > 0 ? (
            <div className="grid grid-cols-2 items-center gap-4">
              <Label className="text-right font-semibold pr-2">
                Subcategory
              </Label>
              <select
                value={localData.businessSubcategory}
                onChange={(e) =>
                  handleChange("businessSubcategory", e.target.value)
                }
                className="border rounded p-2"
              >
                <option value="">Select one</option>
                {subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            renderField("Subcategory", "businessSubcategory")
          )}

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
              Online Status
            </Label>
            {editMode ? (
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="online"
                    checked={localData.onlineStatus === "online"}
                    onChange={() => handleChange("onlineStatus", "online")}
                  />
                  Online
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="notOnline"
                    checked={localData.onlineStatus === "notOnline"}
                    onChange={() => handleChange("onlineStatus", "notOnline")}
                  />
                  Not Online
                </label>
              </div>
            ) : (
              <p>{localData.onlineStatus}</p>
            )}
          </div>

          {localData.onlineStatus === "online" &&
            renderField("Online Link", "onlineLink")}

          <div className="flex gap-2 mt-6">
            <Button onClick={handleBack} className="w-1/2 rounded-none">
              <MdOutlineKeyboardReturn className="mr-1" /> Back
            </Button>
            {editMode ? (
              <Button onClick={handleSave} className="w-1/2 rounded-none">
                Save
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="w-1/2 rounded-none">
                Submit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

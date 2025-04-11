"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";
import { MdOutlineKeyboardReturn } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { useAppDispatch, useAppSelector } from "../../../lib/redux/hooks";
import {
  setFormData,
  setStep,
} from "../../../lib/redux/slices/onboardingSlice";
import FormHeader from "../FormHeader";

const subcategories: Record<string, string[]> = {
  "retail-misc": ["Electronics", "Books", "Toys", "Home Decor"],
  "food-hospitality": ["Restaurant", "Cafe", "Catering", "Bar"],
  professional: ["Consulting", "Legal Services", "Finance", "Education"],
  "health-beauty": ["Salon", "Spa", "Gym", "Medical Clinic"],
  services: ["Automotive", "Cleaning", "Repair", "IT Support"],
  clothing: ["Boutique", "Sportswear", "Formal Wear", "Casual"],
  leisure: ["Music Studio", "Cinema", "Gaming Lounge", "Theater"],
  retail: ["Supermarket", "Department Store", "Pet Store", "Furniture"],
  other: ["Freelance", "Handmade Goods", "Custom Services", "Miscellaneous"],
};

export default function StepThreeSubcategory() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const step = useAppSelector((state) => state.onboarding.step);
  const formData = useAppSelector((state) => state.onboarding.formData);

  const [selected, setSelected] = useState(formData.businessSubcategory || "");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const category = formData.businessCategory;

  useEffect(() => {
    if (formData.businessSubcategory) {
      setSelected(formData.businessSubcategory);
    }
  }, [formData.businessSubcategory]);

  const handleSelect = async (subcategory: string) => {
    setSelected(subcategory);
    dispatch(setFormData({ businessSubcategory: subcategory }));

    const res = await fetch("/api/validate-subcategory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessSubcategory: subcategory }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      const msg =
        error?.businessSubcategory?._errors?.[0] || "Invalid subcategory";
      setErrorMessage(msg);
      return;
    }

    dispatch(setStep(step + 1));
    router.push(`new-user/4`);
  };

  const handleCustomInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomSubcategory(value);
    dispatch(setFormData({ businessSubcategory: value }));
  };

  const handleNext = async () => {
    const value = selected || customSubcategory.trim();

    if (!value) {
      setErrorMessage("Please choose or enter a subcategory");
      return;
    }

    const res = await fetch("/api/validate-subcategory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessSubcategory: value }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      setErrorMessage(
        error?.businessSubcategory?._errors?.[0] || "Invalid subcategory"
      );
      return;
    }

    dispatch(setStep(step + 1));
    router.push(`/dashboard/new-user/4`);
  };

  const handleBack = () => {
    dispatch(setStep(step - 1));
    router.push(`/dashboard/new-user/3`);
  };

  return (
    <>
      <FormHeader
        h2="Business Subcategory"
        p="Select or enter the subcategory that best describes your business"
      />
      <Card className="rounded-none shadow-lg p-0 mb-0 gap-0">
        <CardContent className="w-full p-0 mb-0">
          <div className="grid grid-cols-1 w-full rounded-b-md">
            {subcategories[category ?? ""]?.map((sub) => (
              <button
                key={sub}
                className={`p-6 flex justify-between items-center border-b transition-all duration-200 ${
                  selected === sub
                    ? "bg-primary text-white"
                    : "bg-card text-card-foreground"
                } hover:bg-primary/50 hover:text-black hover:cursor-pointer`}
                onClick={() => handleSelect(sub)}
              >
                <span className="text-left">{sub}</span>
                <FaChevronRight />
              </button>
            ))}
            <div className="p-6 flex flex-col border-t">
              <input
                type="text"
                placeholder="Other (please specify)"
                value={customSubcategory}
                onChange={handleCustomInput}
                className="p-2 border rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex w-full">
            <Button
              onClick={handleBack}
              className="p-4 w-1/2 flex items-center gap-2 hover:cursor-pointer rounded-none"
            >
              <MdOutlineKeyboardReturn /> Back
            </Button>
            <Button
              onClick={handleNext}
              className="p-4 w-1/2 bg-primary text-white rounded-none"
              disabled={!selected && !customSubcategory.trim()}
            >
              Next
            </Button>
          </div>
        </CardContent>
        {errorMessage && (
          <CardFooter>
            <p className="text-red-600 p-4 pb-4 text-sm">{errorMessage}</p>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

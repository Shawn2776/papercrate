"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";
import { MdOutlineKeyboardReturn } from "react-icons/md";

import {
  ShoppingBag,
  Utensils,
  Briefcase,
  HeartPulse,
  Wrench,
  Shirt,
  Music,
  Store,
  Ellipsis,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "../../../lib/redux/hooks";
import {
  setFormData,
  setStep,
} from "../../../lib/redux/slices/onboardingSlice";
import { businessCategorySchema } from "../../../lib/validation";
import FormHeader from "../FormHeader";

interface BusinessCategory {
  id: string;
  name: string;
  icon: React.ElementType;
}

const businessCategories: BusinessCategory[] = [
  { id: "retail-misc", name: "Retail - Miscellaneous", icon: ShoppingBag },
  {
    id: "food-hospitality",
    name: "Food, Drinks and Hospitality",
    icon: Utensils,
  },
  {
    id: "professional",
    name: "Professional Services and Organizations",
    icon: Briefcase,
  },
  {
    id: "health-beauty",
    name: "Health, Beauty and Wellness",
    icon: HeartPulse,
  },
  { id: "services", name: "Services", icon: Wrench },
  { id: "clothing", name: "Clothing and Apparel", icon: Shirt },
  { id: "leisure", name: "Leisure and Entertainment", icon: Music },
  { id: "retail", name: "Retail", icon: Store },
  { id: "other", name: "Other", icon: Ellipsis },
];

export default function StepTwoCategory() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const step = useAppSelector((state) => state.onboarding.step);
  const formData = useAppSelector((state) => state.onboarding.formData);

  const [selected, setSelected] = useState(formData.businessCategory || "");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (formData.businessCategory) {
      setSelected(formData.businessCategory);
    }
  }, [formData.businessCategory]);

  const handleSelect = async (category: BusinessCategory) => {
    setErrorMessage("");

    const client = businessCategorySchema.safeParse({
      businessCategory: category.id,
    });

    if (!client.success) {
      setErrorMessage(
        client.error.format().businessCategory?._errors?.[0] ?? "Invalid input"
      );
      return;
    }

    const res = await fetch("/api/validate-category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessCategory: category.id }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      const bizErr = error?.businessCategory?._errors?.[0];
      setErrorMessage(bizErr || "Server validation failed");
      return;
    }

    setSelected(category.id);
    dispatch(setFormData({ businessCategory: category.id }));
    dispatch(setStep(step + 1));
    router.push(`/dashboard/new-user/3`);
  };

  const handleBack = () => {
    if (step > 1) {
      dispatch(setStep(step - 1));
      router.push(`/dashboard/new-user/2`);
    }
  };

  return (
    <>
      <FormHeader
        h2="Business Category"
        p="Choose the category that best describes your business"
      />
      <Card className="rounded-none shadow-lg p-0 mb-0 gap-0">
        <CardContent className="w-full p-0 mb-0">
          {businessCategories.map((category) => (
            <button
              key={category.id}
              className={`w-full h-20 flex px-4 justify-between items-center border-b transition-all duration-200 ${
                selected === category.id
                  ? "bg-primary text-white"
                  : "bg-card text-card-foreground"
              } hover:bg-primary/50 hover:text-black hover:cursor-pointer`}
              onClick={() => handleSelect(category)}
            >
              <div className="flex items-center gap-4">
                <category.icon className="w-6 h-6" />
                <span className="text-left">{category.name}</span>
              </div>
              <FaChevronRight />
            </button>
          ))}

          <Button onClick={handleBack} className="w-1/2 rounded-none">
            <MdOutlineKeyboardReturn className="mr-1" /> Back
          </Button>
        </CardContent>
        {errorMessage && (
          <CardFooter>
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

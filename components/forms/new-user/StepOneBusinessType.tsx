"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Users,
  Building2,
  Building,
  UsersRound,
} from "lucide-react";
import { FaChevronRight } from "react-icons/fa";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { useAppDispatch, useAppSelector } from "../../../lib/redux/hooks";
import {
  setFormData,
  setStep,
} from "../../../lib/redux/slices/onboardingSlice";
import FormHeader from "../FormHeader";

interface BusinessType {
  id: string;
  name: string;
  icon: React.ElementType;
}

const businessTypes: BusinessType[] = [
  { id: "sole-proprietorship", name: "Sole Proprietorship", icon: Briefcase },
  { id: "partnership", name: "Partnership", icon: Users },
  { id: "llc", name: "Limited Liability Company", icon: Building2 },
  { id: "corporation", name: "Corporation", icon: Building },
  {
    id: "unincorporated",
    name: "Unincorporated Business Association or Organization",
    icon: UsersRound,
  },
  {
    id: "individual",
    name: "Individual / Sole Trader",
    icon: Briefcase,
  },
];

const StepOneBusinessType = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selected, setSelected] = useState<string>("");

  const dispatch = useAppDispatch();
  const step = useAppSelector((state) => state.onboarding.step);

  const router = useRouter();

  const handleSelect = async (type: BusinessType) => {
    setSelected(type.id);
    setErrorMessage("");

    try {
      const res = await fetch("/api/validate-business-type", {
        method: "POST",
        body: JSON.stringify({ businessType: type.id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.message || "Invalid selection");
        return;
      }

      dispatch(setFormData({ businessType: type.id }));
      dispatch(setStep(step + 1));
      router.push(`/new-user/2`);
    } catch (err) {
      console.log(err);
      setErrorMessage("Server error. Please try again.");
    }
  };

  return (
    <>
      <FormHeader
        h2="Business Type"
        p="Select the legal type of your business"
      />
      <Card className="shadow-md border rounded-lg overflow-hidden">
        <CardContent className="p-0">
          {businessTypes.map((type) => (
            <button
              key={type.id}
              className={`w-full h-20 flex items-center justify-between px-6 border-b last:border-0 transition ${
                selected === type.id
                  ? "bg-primary text-white"
                  : "hover:bg-muted/70"
              }`}
              onClick={() => handleSelect(type)}
            >
              <div className="flex items-center gap-4">
                <type.icon className="w-5 h-5" />
                <span className="text-left font-medium">{type.name}</span>
              </div>
              <FaChevronRight />
            </button>
          ))}
        </CardContent>

        {errorMessage && (
          <CardFooter className="bg-red-100 text-red-700 text-sm p-4">
            {errorMessage}
          </CardFooter>
        )}
      </Card>
    </>
  );
};

export default StepOneBusinessType;

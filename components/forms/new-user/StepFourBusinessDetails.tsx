"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineKeyboardReturn } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAppDispatch, useAppSelector } from "../../../lib/redux/hooks";
import {
  setFormData,
  setStep,
} from "../../../lib/redux/slices/onboardingSlice";
import FormHeader from "../FormHeader";
import { states } from "@/components/states/States";

const StepFourBusinessDetails = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const formData = useAppSelector((state) => state.onboarding.formData);
  const step = useAppSelector((state) => state.onboarding.step);

  const [legalBusinessName, setLegalBusinessName] = useState(
    formData.legalBusinessName || ""
  );
  const [doingBusinessAs, setDoingBusinessAs] = useState(
    formData.doingBusinessAs || ""
  );
  const [ein, setEin] = useState(formData.ein || "");
  const [addressLine1, setAddressLine1] = useState(formData.addressLine1 || "");
  const [addressLine2, setAddressLine2] = useState(formData.addressLine2 || "");
  const [zip, setZip] = useState(formData.zip || "");
  const [city, setCity] = useState(formData.city || "");
  const [selectedState, setSelectedState] = useState(
    formData.businessState || ""
  );
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [businessEmail, setBusinessEmail] = useState(
    formData.businessEmail || ""
  );
  const [onlineStatus, setOnlineStatus] = useState(
    formData.onlineStatus || "notOnline"
  );
  const [onlineLink, setOnlineLink] = useState(formData.onlineLink || "");

  const handleBack = () => {
    dispatch(setStep(step - 1));
    router.push(`/new-user/3`);
  };

  const handleNext = () => {
    if (onlineStatus === "online" && !onlineLink.trim()) return;

    dispatch(
      setFormData({
        legalBusinessName,
        doingBusinessAs,
        ein,
        addressLine1,
        addressLine2,
        zip,
        city,
        businessState: selectedState,
        businessEmail,
        isManualEntry,
        onlineStatus,
        onlineLink,
      })
    );

    dispatch(setStep(step + 1));
    router.push(`/new-user/5`);
  };

  useEffect(() => {
    const lookupZip = async () => {
      if (zip.length !== 5) {
        setCity("");
        setSelectedState("");
        setIsManualEntry(false);
        return;
      }

      try {
        const res = await fetch(`/api/address/zipcode?zip=${zip}`);
        const data = await res.json();

        if (res.ok && data.city && data.state) {
          setCity(data.city);
          setSelectedState(data.state);
          setIsManualEntry(false);
        } else {
          setCity("");
          setSelectedState("");
          setIsManualEntry(true);
        }
      } catch (err) {
        console.error("ZIP lookup failed:", err);
        setCity("");
        setSelectedState("");
        setIsManualEntry(true);
      }
    };

    lookupZip();
  }, [zip]);

  return (
    <>
      <FormHeader
        h2="Business Details"
        p="Enter your business information to complete onboarding."
      />
      <Card className="rounded-none shadow-lg p-2 mb-0 gap-0">
        <CardContent className="w-full p-0 mb-0 space-y-4">
          <Label>Legal Business Name</Label>
          <Input
            value={legalBusinessName}
            onChange={(e) => setLegalBusinessName(e.target.value)}
          />

          <Label>Doing Business As (Optional)</Label>
          <Input
            value={doingBusinessAs}
            onChange={(e) => setDoingBusinessAs(e.target.value)}
          />

          <Label>EIN</Label>
          <Input value={ein} onChange={(e) => setEin(e.target.value)} />

          <Label>Business Email</Label>
          <Input
            type="email"
            placeholder="e.g., contact@yourcompany.com"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
          />

          <Label>Address Line 1</Label>
          <Input
            placeholder="Street address"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
          />

          <Label>Address Line 2 (Optional)</Label>
          <Input
            placeholder="Apt, Suite, etc."
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
          />

          <Label>ZIP Code</Label>
          <Input
            placeholder="e.g., 83815"
            maxLength={5}
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />

          {!isManualEntry && city && selectedState && (
            <>
              <Label>City</Label>
              <Input value={city} readOnly />

              <Label>State</Label>
              <Input value={selectedState} readOnly />
            </>
          )}

          {isManualEntry && (
            <>
              <Label>City (manual entry)</Label>
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <Label>State (manual entry)</Label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </>
          )}

          <Label>Online Presence</Label>
          <div className="flex gap-6">
            <Label className="inline-flex items-center">
              <input
                type="radio"
                value="online"
                checked={onlineStatus === "online"}
                onChange={() => setOnlineStatus("online")}
              />
              <span className="ml-2">Social Media or Website</span>
            </Label>
            <Label className="inline-flex items-center">
              <input
                type="radio"
                value="notOnline"
                checked={onlineStatus === "notOnline"}
                onChange={() => setOnlineStatus("notOnline")}
              />
              <span className="ml-2">Not online</span>
            </Label>
          </div>

          {onlineStatus === "online" && (
            <Input
              placeholder="https://yourcompany.com"
              value={onlineLink}
              onChange={(e) => setOnlineLink(e.target.value)}
            />
          )}

          <div className="flex items-center">
            <Button
              onClick={handleBack}
              className="w-1/2 rounded-none border-r"
            >
              <MdOutlineKeyboardReturn className="mr-1" /> Back
            </Button>
            <Button onClick={handleNext} className="w-1/2 rounded-none">
              Next
            </Button>
          </div>
        </CardContent>
        <CardFooter />
      </Card>
    </>
  );
};

export default StepFourBusinessDetails;

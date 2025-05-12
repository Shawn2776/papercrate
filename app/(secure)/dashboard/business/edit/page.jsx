"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fullBusinessSchema } from "@/lib/schemas/business";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

export default function EditBusinessPage() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetch("/api/business")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch business data.");
        return res.json();
      })
      .then((data) => {
        // Normalize empty fields to avoid null errors
        const cleanedData = {
          ...data,
          phone: data.phone || "",
          addressLine1: data.addressLine1 || "",
          addressLine2: data.addressLine2 || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          postalCode: data.postalCode || "",
          website: data.website || "",
        };
        setBusiness(cleanedData);
      })
      .catch((error) => {
        console.error("Error fetching business:", error);
        setBusiness(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedBusiness = {
      ...business,
      phone: business.phone || "",
      addressLine2: business.addressLine2 || "",
      website: business.website || "",
    };

    const parsed = fullBusinessSchema.safeParse(cleanedBusiness);

    if (!parsed.success) {
      const { formErrors, fieldErrors } = parsed.error.flatten();
      setErrors(fieldErrors);
      setErrorMessage(formErrors.join(" "));
      return;
    }

    setErrors({});
    setErrorMessage("");

    try {
      const res = await fetch("/api/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        setErrorMessage(
          errorData.error ||
            "Failed to update business. Please try again later."
        );
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again later.");
    }
  };

  if (loading) return <p className="p-4">Loading business...</p>;
  if (!business) return <p className="p-4">Business not found.</p>;

  const renderField = (label, name, type = "text") => (
    <div className="flex items-start gap-4 flex-col sm:flex-row">
      <label className="sm:w-1/2 font-medium text-sm mt-2">{label}</label>
      <div className="sm:w-1/2 w-full">
        <Input
          type={type}
          value={business[name] || ""}
          onChange={(e) => setBusiness({ ...business, [name]: e.target.value })}
          className={errors[name] ? "border-red-500" : ""}
        />
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    </div>
  );

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <Button onClick={handleCancel} variant="outline" className="mb-5">
        <ArrowBigLeft />
        Cancel
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Business Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <p className="text-red-500 text-sm -mt-2 mb-2">{errorMessage}</p>
            )}

            {renderField("Business Name", "name")}
            {renderField("Email", "email", "email")}
            {renderField("Phone", "phone")}
            {renderField("Address Line 1", "addressLine1")}
            {renderField("Address Line 2", "addressLine2")}
            {renderField("City", "city")}
            {renderField("State", "state")}
            {renderField("Postal Code", "postalCode")}
            {renderField("Country", "country")}
            {renderField("Website", "website")}

            <Button type="submit" className="w-full mt-4">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

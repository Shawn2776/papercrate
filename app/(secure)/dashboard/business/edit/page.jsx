"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fullBusinessSchema } from "@/lib/schemas/business";

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
      .then((data) => setBusiness(data))
      .catch((error) => {
        console.error("Error fetching business:", error);
        setBusiness(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🛠 Raw form data before cleaning:", business);

    const cleanedBusiness = {
      ...business,
      phone: business.phone || null,
      addressLine2: business.addressLine2 || null,
      website: business.website || null,
    };

    console.log("🧹 Cleaned form data:", cleanedBusiness);

    const parsed = fullBusinessSchema.safeParse(cleanedBusiness);

    if (!parsed.success) {
      console.error(
        "❌ Validation errors:",
        parsed.error.flatten().fieldErrors
      );
      setErrors(parsed.error.flatten().fieldErrors);
      setErrorMessage("Please fix the errors before submitting.");
      return;
    }

    console.log("✅ Validation passed, data to submit:", parsed.data);

    setErrors({});
    setErrorMessage("");

    const res = await fetch("/api/business", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    console.log("📦 API Response Status:", res.status);

    if (res.ok) {
      console.log("🎯 Successfully updated business!");
      router.push("/dashboard");
    } else {
      console.error("❌ Failed to update business.");
      setErrorMessage("Failed to update business. Please try again later.");
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
        />
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    </div>
  );

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
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

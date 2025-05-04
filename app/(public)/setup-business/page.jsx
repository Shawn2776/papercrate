// app/setup-business/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { initialBusinessSchema } from "@/lib/schemas/business";

export default function SetupBusinessPage() {
  const { user } = useUser();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  useEffect(() => {
    const checkBusiness = async () => {
      try {
        const res = await fetch("/api/business");
        if (res.ok) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("❌ Error checking business:", err);
      }
    };

    if (user) {
      checkBusiness();
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const parsed = initialBusinessSchema.safeParse({ name, email });

    if (!parsed.success) {
      setErrors(parsed.error.errors.map((err) => err.message));
      setLoading(false);
      return;
    }

    const res = await fetch("/api/business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setErrors(["Failed to create business."]);
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Set Up Your Business</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.length > 0 && (
              <ul className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm space-y-1">
                {errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Business Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" value={email} disabled />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Business"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useUser();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/business/me")
      .then((res) => {
        if (res.status === 404) {
          router.push("/setup-business");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data) setBusiness(data);
      })
      .catch(() => {
        router.push("/setup-business");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) return <p className="p-4">Loading dashboard...</p>;

  return (
    <main className="max-w-5xl mx-auto py-12 px-4 space-y-6">
      <header className="flex justify-between items-center mb-6 w-full">
        <h1 className="text-2xl font-semibold">
          Welcome,{" "}
          {user?.firstName ||
            user?.primaryEmailAddress?.emailAddress ||
            "there"}
          !
        </h1>
        <UserButton />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Business Info */}
        <Card>
          <CardHeader>
            <CardTitle>Your Business</CardTitle>
          </CardHeader>
          <CardContent>
            {business ? (
              <>
                <p>
                  <strong>Name:</strong> {business.name}
                </p>
                <p>
                  <strong>Email:</strong> {business.email}
                </p>
                <Button className="mt-4" variant="outline">
                  Edit Business
                </Button>
              </>
            ) : (
              <p>Loading business info...</p>
            )}
          </CardContent>
        </Card>

        {/* Create Invoice */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="default">
              Create Invoice
            </Button>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No invoices yet.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

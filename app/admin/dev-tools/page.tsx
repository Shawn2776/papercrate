"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminDevToolsPage() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateTenant = async () => {
    if (!userId) return toast.error("User ID is required");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/create-test-tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
      } else {
        toast.success(`Created tenant: ${data.name}`);
      }
    } catch (err) {
      toast.error("Failed to create tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto py-12 px-4 space-y-4">
      <h1 className="text-xl font-semibold">Admin Dev Tools</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium">User ID</label>
        <Input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter the User ID"
        />
      </div>

      <Button onClick={handleCreateTenant} disabled={loading || !userId}>
        {loading ? "Creating..." : "Create Test Tenant for User"}
      </Button>
    </main>
  );
}

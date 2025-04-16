// app/admin/page.tsx
"use client";

import { getErrorMessage } from "@/lib/functions/getErrorMessage";
import { useEffect, useState } from "react";

export default function AdminHomePage() {
  const [roles, setRoles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/admin/roles"); // adjust path if needed
        if (!res.ok) throw new Error("Failed to fetch roles");
        const data = await res.json();
        setRoles(data.roles);
      } catch (error: unknown) {
        const err = getErrorMessage(error);
        setError(err || "Something went wrong");
      }
    };

    fetchRoles();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome, Superadmin 👑</h1>
        <p className="text-muted-foreground">
          Use the sidebar to manage everything in the system.
        </p>
      </div>
      <div>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Available Roles</h2>
          {error && <p className="text-red-600">{error}</p>}
          <ul className="list-disc pl-6 space-y-1">
            {roles.map((role) => (
              <li key={role}>{role.replace(/_/g, " ")}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setAuth } from "@/lib/redux/slices/authSlice";
import { Role, Permission } from "@/lib/constants/permissions";

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function loadPermissions() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Failed to fetch auth info");
        const data = await res.json();

        dispatch(
          setAuth({
            role: data.role as Role,
            permissions: data.permissions as Permission[],
            loading: false, // ✅ add this
          })
        );
      } catch (error) {
        console.error("Auth initialization failed", error);
      }
    }

    loadPermissions();
  }, [dispatch]);

  return null;
}

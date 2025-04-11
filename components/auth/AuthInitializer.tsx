"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setAuth } from "@/lib/redux/slices/authSlice";
import { Permission, Role } from "@prisma/client";

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
        dispatch(
          setAuth({
            role: null,
            permissions: [],
            loading: false, // ✅ Still set loading to false even on error
          })
        );
      }
    }

    loadPermissions();
  }, [dispatch]);

  return null;
}

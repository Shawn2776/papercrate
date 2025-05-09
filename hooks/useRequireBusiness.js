"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function useRequireBusiness() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchBusiness = async () => {
      try {
        const res = await fetch("/api/business");
        if (res.status === 404) {
          router.push("/setup-business");
          return;
        }

        const data = await res.json();
        setBusiness(data);
      } catch (error) {
        router.push("/setup-business");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [isLoaded, isSignedIn, router]);

  return { business, loading };
}

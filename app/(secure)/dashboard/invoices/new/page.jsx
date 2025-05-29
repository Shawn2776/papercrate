// app > (secure) > dashboard > invoices > new > page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NewInvoiceForm from "@/components/forms/invoices/form/AltInvoiceForm";

export default function NewInvoicePage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkLimits = async () => {
      try {
        const res = await fetch("/api/invoices/limit");
        const data = await res.json();

        if (!data?.allowed) {
          toast("Invoice Limit Reached", {
            description:
              "You’ve reached your invoice limit for your current plan.",
            action: {
              label: "Upgrade",
              onClick: () => router.push("/dashboard/settings/billing"),
            },
          });

          setTimeout(() => {
            router.replace("/dashboard/invoices");
          }, 1000);
        } else {
          setAllowed(true);
        }
      } catch (err) {
        console.error("Invoice limit check failed:", err);
        toast.error("Failed to verify plan limits.");
        router.replace("/dashboard/invoices");
      }
    };

    checkLimits();
  }, [router]);

  if (allowed === null) return null; // Loading or still checking

  return <NewInvoiceForm />;
}

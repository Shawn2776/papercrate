"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";
import { CreditCard, Crown, DollarSign, Settings } from "lucide-react";

const plans = [
  {
    id: "FREE",
    name: "Free",
    icon: DollarSign,
    description: "For individuals or testing.",
    prices: {
      monthly: "$0/mo",
      annual: "$0/mo",
    },
    features: ["1 tenant", "Basic usage"],
  },
  {
    id: "ENHANCED",
    name: "Enhanced",
    icon: Settings,
    description: "For small businesses.",
    prices: {
      monthly: "$9/mo",
      annual: "$86/yr",
    },
    features: ["1 tenant", "Enhanced support", "More integrations"],
  },
  {
    id: "PRO",
    name: "Pro",
    icon: Crown,
    description: "For growing teams and multi-tenants.",
    prices: {
      monthly: "$19/mo",
      annual: "$182/yr",
    },
    features: ["Unlimited tenants", "Advanced analytics", "Priority support"],
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    icon: CreditCard,
    description: "Custom plans for larger organizations.",
    prices: {
      monthly: "Contact us",
      annual: "Contact us",
    },
    features: ["Unlimited tenants", "Custom integrations", "Dedicated support"],
  },
];

export default function BillingPage() {
  const router = useRouter();
  const currentTenant = useAppSelector(selectCurrentTenant);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [renewalDate, setRenewalDate] = useState<string | null>(null);
  const currentPlan = currentTenant?.selectedPlan?.toUpperCase() ?? "FREE";

  useEffect(() => {
    if (currentTenant?.stripeSubscriptionId) {
      fetch("/api/stripe/subscription-info")
        .then((res) => res.json())
        .then((data) => {
          if (data.renewalDate) {
            const date = new Date(data.renewalDate);
            const formatted = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            setRenewalDate(formatted);
          }
        })
        .catch((err) => console.error("Failed to load renewal date:", err));
    }
  }, [currentTenant?.stripeSubscriptionId]);

  const handleUpgrade = async (planId: string) => {
    if (planId === "ENTERPRISE") {
      return window.open("mailto:sales@yourcompany.com", "_blank");
    }

    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planId.toLowerCase(), billingCycle }),
    });

    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      console.error("Stripe error:", data);
    }
  };

  const openStripePortal = async () => {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-4">Choose Your Plan</h1>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3 items-center">
          <label className="text-sm font-medium">Billing Cycle:</label>
          <select
            value={billingCycle}
            onChange={(e) =>
              setBillingCycle(e.target.value as "monthly" | "annual")
            }
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="monthly">Monthly</option>
            <option value="annual">Annual (Save 20%)</option>
          </select>
        </div>

        {currentTenant?.stripeSubscriptionId && (
          <div className="text-xs text-muted-foreground">
            {renewalDate && <span>Renews on {renewalDate}</span>}
            <Button
              variant="link"
              className="text-xs ml-4"
              onClick={openStripePortal}
            >
              Manage billing
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const Icon = plan.icon;

          return (
            <Card
              key={plan.id}
              className={`relative transition-all transform hover:scale-[1.02] hover:shadow-xl ${
                isCurrent ? "border-primary" : ""
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex gap-2 items-center text-lg">
                    <Icon className="w-5 h-5" />
                    {plan.name}
                  </CardTitle>
                  {isCurrent && <Badge variant="default">Current</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold mb-2">
                  {plan.prices[billingCycle]}
                </p>
                <ul className="text-sm mb-4 space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button variant="outline" disabled className="w-full">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => handleUpgrade(plan.id)}
                    className="w-full"
                  >
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}

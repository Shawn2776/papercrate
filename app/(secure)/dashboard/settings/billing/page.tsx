"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectCurrentTenant } from "@/lib/redux/slices/tenantSlice";

const plans = [
  {
    id: "FREE",
    name: "Free",
    description: "For individuals or testing.",
    price: "$0/mo",
    features: ["1 tenant", "Basic usage"],
  },
  {
    id: "BASIC",
    name: "Basic",
    description: "For small businesses.",
    price: "$5/mo",
    features: ["1 tenant", "Limited integrations"],
  },
  {
    id: "PRO",
    name: "Pro",
    description: "For growing teams and multi-tenants.",
    price: "$19/mo",
    features: ["Unlimited tenants", "Advanced analytics", "Priority support"],
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    description: "Custom plans for larger organizations.",
    price: "Contact us",
    features: ["Unlimited tenants", "Custom integrations", "Dedicated support"],
  },
];

export default function BillingPage() {
  const router = useRouter();
  const currentTenant = useAppSelector(selectCurrentTenant);
  const currentPlan = currentTenant?.plan || "FREE";

  const handleUpgrade = (planId: string) => {
    // In the future, you can integrate Stripe Checkout here
    alert(`Pretend we're upgrading to: ${planId}`);
    // router.push(`/billing/checkout?plan=${planId}`);
  };

  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-6">Choose Your Plan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;

          return (
            <Card key={plan.id} className={isCurrent ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold mb-2">{plan.price}</p>
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

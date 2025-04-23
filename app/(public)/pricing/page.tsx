// app/pricing/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const plans = [
  {
    title: "Free",
    desc: "Get started with core invoicing features at no cost.",
    monthly: "$0/mo",
    annual: "$0/yr",
    features: ["Create invoices", "Track expenses"],
    button: "Start Free",
  },
  {
    title: "Basic",
    desc: "Ideal for small teams or freelancers.",
    monthly: "$5/mo",
    annual: "$50/yr",
    features: ["Single tenant", "Up to 3 users", "Custom Branding"],
    button: "Choose Basic",
  },
  {
    title: "Pro",
    desc: "Advanced features for teams and agencies.",
    monthly: "$15/mo",
    annual: "$150/yr",
    features: ["Up to 3 tenants", "Up to 10 users", "Audit logs"],
    button: "Go Pro",
    highlight: true,
  },
  {
    title: "Enterprise",
    desc: "Custom solutions for organizations at scale.",
    monthly: "Custom",
    annual: "Custom",
    features: [
      "Everything in Pro",
      "Dedicated infrastructure",
      "Custom integrations",
    ],
    button: "Coming Soon",
    outline: true,
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  return (
    <div className="">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-tight">
            Transparent Pricing
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose a plan that scales with your needs. No hidden fees.
          </p>
        </div>

        {/* Toggle Billing Cycle */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 border rounded-l-md text-sm font-medium ${
              billingCycle === "monthly"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-2 border rounded-r-md text-sm font-medium ${
              billingCycle === "annual"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Annual <span className="ml-1">(Save ~20%)</span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={`border rounded-2xl p-6 flex flex-col shadow-sm ${
                plan.highlight
                  ? "bg-muted border-2 border-primary shadow-md relative"
                  : "bg-background"
              } ${plan.outline ? "bg-background" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute top-4 right-4 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full uppercase font-medium">
                  Most Popular
                </div>
              )}
              <h2 className="text-xl font-semibold mb-1">{plan.title}</h2>
              <p className="text-muted-foreground text-sm mb-4">{plan.desc}</p>
              <p className="text-3xl font-bold mb-6">{plan[billingCycle]}</p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f}>✔ {f}</li>
                ))}
              </ul>
              <button
                className={`mt-auto px-4 py-2 text-sm font-medium rounded ${
                  plan.outline
                    ? "bg-muted text-foreground border border-input hover:bg-accent"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="bg-muted w-full">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="md:text-left text-center w-full md:w-auto">
                <p className="text-lg font-semibold">
                  <span className="block md:inline">
                    Send your first invoice today
                  </span>{" "}
                  <span className="text-sm text-muted-foreground font-normal">
                    No credit card required — it&apos;s completely free to
                    start.
                  </span>
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const params = new URLSearchParams({
                    prefill_email: email,
                    prefill_first_name: name,
                    redirect_url: "/new-user/1",
                  });
                  router.push(`/sign-up?${params.toString()}`);
                }}
                className="flex flex-col sm:flex-row gap-2 w-full md:w-auto justify-end"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 border rounded-md text-sm w-full sm:w-56"
                />
                <input
                  type="text"
                  placeholder="Your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-2 border rounded-md text-sm w-full sm:w-44"
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-orange-600 w-full sm:w-auto"
                >
                  Get Started
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

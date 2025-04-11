"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PricingPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            Transparent Pricing
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose a plan that scales with your needs. No hidden fees.
          </p>
        </div>

        {/* Top Card-style Summary */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {[
            {
              title: "Free",
              desc: "Get started at no cost",
              price: "$0/mo",
              features: [
                "Create invoices",
                "Track expenses",
                "✘ Custom branding",
              ],
              button: "Start Free",
            },
            {
              title: "Basic",
              desc: "For solo professionals",
              price: "$5/mo",
              features: ["3 tenants", "Up to 10 users", "Custom branding"],
              button: "Choose Basic",
            },
            {
              title: "Pro",
              desc: "Advanced tools for teams",
              price: "$15/mo",
              features: [
                "Unlimited tenants & users",
                "Audit logs",
                "Priority support",
              ],
              button: "Go Pro",
              highlight: true,
            },
            {
              title: "Enterprise",
              desc: "Custom solutions for scale",
              price: "Custom",
              features: [
                "Everything in Pro",
                "Dedicated infra",
                "Custom integrations",
              ],
              button: "Contact Sales",
              outline: true,
            },
          ].map((plan, i) => (
            <div
              key={plan.title}
              className={`border rounded-2xl p-6 flex flex-col shadow-sm ${
                plan.highlight
                  ? "bg-muted border-2 border-primary shadow-md relative"
                  : ""
              } ${plan.outline ? "bg-background" : "bg-background"}`}
            >
              {plan.highlight && (
                <div className="absolute top-4 right-4 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full uppercase font-medium">
                  Most Popular
                </div>
              )}
              <h2 className="text-xl font-semibold mb-1">{plan.title}</h2>
              <p className="text-muted-foreground text-sm mb-4">{plan.desc}</p>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
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

        {/* Feature Comparison Table */}
        <div className="overflow-x-auto mb-16 max-w-3xl mx-auto">
          <table className="min-w-full border-separate border-spacing-y-6">
            <thead>
              <tr className="text-sm text-muted-foreground text-left">
                <th className="w-1/4"></th>
                <th className="w-1/4 text-center">Free</th>
                <th className="w-1/4 text-center">Basic</th>
                <th className="w-1/4 text-center">Pro</th>
                <th className="w-1/4 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td className="font-semibold">Price</td>
                <td className="text-center font-medium">$0/mo</td>
                <td className="text-center font-medium">$5/mo</td>
                <td className="text-center font-medium">$15/mo</td>
                <td className="text-center font-medium">Custom</td>
              </tr>
              <tr>
                <td>Invoices</td>
                <td className="text-center">✔</td>
                <td className="text-center">✔</td>
                <td className="text-center">✔</td>
                <td className="text-center">✔</td>
              </tr>
              <tr>
                <td>Track Expenses</td>
                <td className="text-center">✔</td>
                <td className="text-center">✔</td>
                <td className="text-center">✔</td>
                <td className="text-center">✔</td>
              </tr>
              <tr>
                <td>Custom Branding</td>
                <td className="text-center">-</td>
                <td className="text-center">✔</td>
                <td className="text-center">✔</td>
                <td className="text-center">✔</td>
              </tr>
              <tr>
                <td>Multi-Tenant Support</td>
                <td className="text-center">-</td>
                <td className="text-center">-</td>
                <td className="text-center">✔</td>
                <td className="text-center">✔</td>
              </tr>
              <tr>
                <td>Audit Logs</td>
                <td className="text-center">-</td>
                <td className="text-center">-</td>
                <td className="text-center">✔</td>
                <td className="text-center">✔</td>
              </tr>
              <tr>
                <td>Dedicated Support</td>
                <td className="text-center">-</td>
                <td className="text-center">-</td>
                <td className="text-center">-</td>
                <td className="text-center">✔</td>
              </tr>
              <tr>
                <td className="font-semibold">Add-ons</td>
                <td
                  className="text-center text-muted-foreground italic"
                  colSpan={4}
                >
                  + $2/user/mo, + $5 advanced reporting, + priority support
                  $10/mo
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action Sign-up Bar */}
      <div className="bg-muted w-full">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="md:text-left text-center w-full md:w-auto">
              <p className="text-lg font-semibold">
                <span className="block md:inline">
                  Send your first invoice today
                </span>{" "}
                <span className="text-sm text-muted-foreground font-normal">
                  No credit card required — it&apos;s completely free to start.
                </span>
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
              className="flex flex-col sm:flex-row gap-2 w-full md:w-auto justify-end"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 border rounded-md text-sm w-full sm:w-56"
              />
              <input
                type="text"
                placeholder="Your first name"
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thanks for signing up!</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            We&apos;ll follow up soon to help you get started with your first
            invoice.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

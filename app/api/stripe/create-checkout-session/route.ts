import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { getDbUserOrRedirect } from "@/lib/auth/getDbUserOrRedirect";
import { requireTenant } from "@/lib/auth/requireTenant";
import { prisma } from "@/lib/db/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json(); // expects { plan: "basic" | "pro" | ... }

    // 🔐 Get DB user (via Clerk ID)
    const user = await getDbUserOrRedirect();

    // 🔐 Get their active tenant
    const tenantId = await requireTenant(user.id);

    // 🎯 Get the tenant record
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // 👤 Ensure Stripe customer exists
    let stripeCustomerId = tenant.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: tenant.email || undefined,
        name: tenant.name,
        metadata: {
          tenantId,
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { stripeCustomerId },
      });
    }

    // 💵 Map your frontend plan keys to Stripe price IDs
    const priceMap: Record<string, string> = {
      free: process.env.STRIPE_PRICE_FREE!,
      basic: process.env.STRIPE_PRICE_BASIC!,
      pro: process.env.STRIPE_PRICE_PRO!,
      enterprise: process.env.STRIPE_PRICE_ENTERPRISE!,
    };

    const priceId = priceMap[plan];

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // 🎟️ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
      metadata: {
        tenantId,
        userId: user.id,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe Checkout Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

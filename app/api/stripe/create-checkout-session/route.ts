import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { getDbUserOrRedirect } from "@/lib/auth/getDbUserOrRedirect";
import { requireTenant } from "@/lib/auth/requireTenant";
import { prisma } from "@/lib/db/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { plan, billingCycle = "monthly" } = await req.json();

    if (
      !["enhanced", "pro"].includes(plan) ||
      !["monthly", "annual"].includes(billingCycle)
    ) {
      return NextResponse.json(
        { error: "Invalid plan or billing cycle" },
        { status: 400 }
      );
    }

    const user = await getDbUserOrRedirect();
    const tenantId = await requireTenant(user.id);

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // 👤 Create Stripe customer if needed
    let stripeCustomerId = tenant.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: tenant.email || undefined,
        name: tenant.name,
        metadata: { tenantId, userId: user.id },
      });

      stripeCustomerId = customer.id;

      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { stripeCustomerId },
      });
    }

    // 💵 Plan → Price ID mapping
    const priceMap: Record<string, string> = {
      enhanced_monthly: process.env.STRIPE_PRICE_ENHANCED_MONTHLY!,
      enhanced_annual: process.env.STRIPE_PRICE_ENHANCED_ANNUAL!,
      pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
      pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL!,
    };

    const priceKey = `${plan}_${billingCycle}`;
    const priceId = priceMap[priceKey];

    if (!priceId) {
      return NextResponse.json(
        { error: `Missing Stripe price for ${priceKey}` },
        { status: 400 }
      );
    }

    // 🧾 Create Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/new-user/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/new-user/5`,
      metadata: {
        tenantId,
        userId: user.id,
        plan,
        billingCycle,
        app: "PaperCrate",
      },
    });

    // ✅ Persist selected plan and billingCycle on tenant
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        selectedPlan: plan,
        billingCycle,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe Checkout Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

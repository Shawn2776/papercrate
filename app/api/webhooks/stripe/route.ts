// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";
import { SelectedPlan } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil", // match your dashboard version
});

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  const data = event.data.object as Stripe.Subscription;

  if (event.type.startsWith("customer.subscription.")) {
    const tenantId = data.metadata?.tenantId;
    const selectedPlan = data.metadata?.plan?.toUpperCase();
    const subscriptionStatus = data.status;
    const stripeSubscriptionId = data.id;

    if (!tenantId) {
      console.warn("No tenantId in subscription metadata");
      return NextResponse.json({ received: true });
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        selectedPlan: {
          set: data.metadata?.plan?.toUpperCase() as SelectedPlan,
        },
        subscriptionStatus,
        stripeSubscriptionId,
      },
    });

    console.log(`✅ Updated tenant ${tenantId} with Stripe info.`);
  }

  return NextResponse.json({ received: true });
}

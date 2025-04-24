// app/api/webhooks/stripe/route.ts
import { headers as nextHeaders } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";
import { BillingCycle, SelectedPlan } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headers = req.headers;
  const sig = headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("⚠️ Webhook signature verification failed:", errorMessage);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;
      const metadata = session.metadata;

      if (!metadata?.tenantId || !metadata?.plan || !metadata?.billingCycle) {
        console.warn("Missing metadata on checkout.session.completed");
        break;
      }

      const selectedPlanString = metadata.plan.toUpperCase();
      const billingCycleString = metadata.billingCycle.toUpperCase();

      if (
        !Object.values(SelectedPlan).includes(
          selectedPlanString as SelectedPlan
        ) ||
        !Object.values(BillingCycle).includes(
          billingCycleString as BillingCycle
        )
      ) {
        console.warn("Invalid SelectedPlan or BillingCycle");
        break;
      }

      await prisma.tenant.update({
        where: { id: metadata.tenantId },
        data: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          selectedPlan: selectedPlanString as SelectedPlan,
          billingCycle: billingCycleString as BillingCycle,
          subscriptionStatus: "active",
        },
      });

      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const subscriptionId = invoice.subscription as string;

      const tenant = await prisma.tenant.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (tenant) {
        await prisma.tenant.update({
          where: { id: tenant.id },
          data: {
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: "active",
          },
        });
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const tenant = await prisma.tenant.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (tenant) {
        await prisma.tenant.update({
          where: { id: tenant.id },
          data: {
            stripeSubscriptionId: null,
            selectedPlan: null,
            billingCycle: null,
            subscriptionStatus: "cancelled",
          },
        });
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}

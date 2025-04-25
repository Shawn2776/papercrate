import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/db";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req) {
  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Server error", { status: 500 });
  }

  const payload = await req.text();
  const headerPayload = await headers();

  const svix = new Webhook(webhookSecret);

  let event;

  try {
    event = svix.verify(
      payload,
      {
        "svix-id": headerPayload.get("svix-id"),
        "svix-timestamp": headerPayload.get("svix-timestamp"),
        "svix-signature": headerPayload.get("svix-signature"),
      },
      payload
    );
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = event;

  if (type === "user.created") {
    const email = data.email_addresses?.[0]?.email_address;

    if (!email) {
      console.error("Email not found in Clerk webhook data.");
      return new Response("Missing email", { status: 400 });
    }

    await prisma.user.upsert({
      where: { email },
      update: {
        name: data.first_name || data.username || "Unnamed",
        clerkId: data.id,
      },
      create: {
        email,
        name: data.first_name || data.username || "Unnamed",
        clerkId: data.id,
      },
    });
  }

  console.log("Unhandled event type:", type);

  return new Response("Webhook received", { status: 200 });
}

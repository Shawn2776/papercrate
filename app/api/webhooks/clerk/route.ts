// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Permission, TenantRole } from "@prisma/client";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error("❌ Missing Clerk signing secret");
    return new Response("Missing Clerk signing secret", { status: 400 });
  }

  const rawBody = await req.text();
  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id") ?? "";
  const svix_timestamp = headerPayload.get("svix-timestamp") ?? "";
  const svix_signature = headerPayload.get("svix-signature") ?? "";

  const wh = new Webhook(SIGNING_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(rawBody, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("📨 Clerk Webhook received:", evt.type);

  if (evt.type === "user.created") {
    const { id: clerkId, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses?.[0]?.email_address;
    const name = `${first_name ?? ""} ${last_name ?? ""}`.trim();

    if (!email) {
      console.error("❌ Missing email in user.created event");
      return new Response("Missing email", { status: 400 });
    }

    let user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
        },
      });
      console.log("✅ User created:", user.id);
    } else {
      console.log("ℹ️ User already exists:", user.id);
    }
  }

  return NextResponse.json({ success: true });
}

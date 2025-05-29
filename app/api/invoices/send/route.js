import crypto from "crypto";
import { prisma } from "@/lib/db";
import { resend } from "@/lib/resend/resend";
import InvoiceEmail from "@/emails/InvoiceEmail";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/dist/types/server";

export async function POST(req) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { business: true },
  });

  if (!dbUser?.businessId) {
    return new NextResponse("No associated business", { status: 404 });
  }

  try {
    const { to, invoiceData } = await req.json();

    if (!to || !invoiceData) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // ✅ Generate access token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7-day expiry

    await prisma.invoiceAccessToken.create({
      data: {
        token,
        invoiceId: invoiceData.id,
        expiresAt,
      },
    });

    const accessUrl = `https://papercrate.io/invoice-access/${token}`;

    const html = render(
      <InvoiceEmail invoice={{ ...invoiceData, accessUrl }} />
    );

    await resend.emails.send({
      from: "shawn@papercrate.io",
      to,
      subject: `Invoice #${invoiceData.number} from ${invoiceData.business?.name}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { resend } from "@/lib/resend/resend";
import { prisma } from "@/lib/db";
import { render } from "@react-email/render";
import ReminderEmail from "@/emails/ReminderEmail";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tokens = await prisma.invoiceAccessToken.findMany({
    where: {
      used: false,
      expiresAt: {
        gte: now,
        lt: tomorrow,
      },
      invoice: {
        status: { not: "PAID" },
        customer: {
          email: { not: null },
        },
      },
    },
    include: {
      invoice: {
        include: {
          customer: true,
          business: true,
        },
      },
    },
  });

  let success = 0;
  let failed = 0;

  for (const t of tokens) {
    const { customer, business } = t.invoice;
    const emailHtml = render(
      <ReminderEmail
        customerName={customer?.name}
        invoiceNumber={t.invoice.number}
        businessName={business?.name}
        accessUrl={`https://papercrate.io/invoice-access/${t.token}`}
      />
    );

    try {
      await resend.emails.send({
        from: "shawn@papercrate.io",
        to: customer.email,
        subject: `Reminder: Invoice #${t.invoice.number} is about to expire`,
        html: emailHtml,
      });
      success++;
    } catch (err) {
      console.error("Reminder send failed:", err);
      failed++;
    }
  }

  return NextResponse.json({ sent: success, failed });
}

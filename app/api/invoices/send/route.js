import { resend } from "@/lib/resend/resend";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { to, invoiceData } = await req.json();

    if (!to || !invoiceData) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const { default: InvoiceEmail } = await import("@/emails/InvoiceEmail");

    const sendResult = await resend.emails.send({
      from: "shawn@papercrate.io", // must match verified domain
      to,
      subject: `Invoice #${invoiceData.number} from ${invoiceData.business?.name || "PaperCrate"}`,
      react: <InvoiceEmail invoice={invoiceData} />,
    });

    console.log("✅ Resend response:", sendResult);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

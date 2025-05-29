import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser?.businessId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: params.id,
      },
      include: {
        customer: true,
        LineItem: true,
      },
    });

    if (!invoice || invoice.businessId !== dbUser.businessId) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const drawText = (text, x, y, size = 12) => {
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0),
      });
    };

    drawText(`Invoice #${invoice.number}`, 50, 750, 18);
    drawText(
      `Date: ${invoice.invoiceDate?.toISOString().split("T")[0]}`,
      50,
      730
    );
    drawText(`Due: ${invoice.dueDate?.toISOString().split("T")[0]}`, 300, 730);
    drawText(`Customer: ${invoice.customer?.name || "Unknown"}`, 50, 710);

    drawText(`Line Items:`, 50, 680, 14);
    let y = 660;
    invoice.LineItem.forEach((item, index) => {
      drawText(
        `${index + 1}. ${item.name} (${item.quantity} × $${item.rate})`,
        60,
        y
      );
      y -= 20;
    });

    drawText(`Total: $${invoice.amount}`, 50, y - 20, 14);

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Invoice-${invoice.number}.pdf`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

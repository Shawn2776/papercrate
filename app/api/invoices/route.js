import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// import { createInvoiceSchema } from "@/lib/schemas/invoice";
import { invoiceSchema } from "@/lib/schemas/invoice"; // ✅ imported

// GET /api/invoices — Get all invoices for current user’s business
export async function GET() {
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

  const invoices = await prisma.invoice.findMany({
    where: {
      businessId: dbUser.businessId,
      deleted: false,
    },
    include: {
      customer: true,
      LineItem: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(invoices);
}

// POST /api/invoices — Create a new invoice
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
    const body = await req.json();
    const data = invoiceSchema.parse(body);

    // Calculate total invoice amount
    const amount = data.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );

    // Find the last invoice number for this business
    const lastInvoice = await prisma.invoice.findFirst({
      where: { businessId: data.businessId },
      orderBy: { createdAt: "desc" },
    });

    let nextNumber = 1;
    if (lastInvoice && lastInvoice.number) {
      const match = lastInvoice.number.match(/INV-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    const invoiceNumber = `INV-${String(nextNumber).padStart(4, "0")}`;

    // Create the invoice
    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        status: data.status,
        amount: amount.toFixed(2),
        invoiceDate: new Date(data.invoiceDate),
        dueDate: new Date(data.dueDate),
        businessId: data.businessId,
        customerId: data.customerId || null,
        LineItem: {
          create: data.items.map((item) => ({
            name: item.name,
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            rate: item.rate.toFixed(2),
            total: (item.quantity * item.rate).toFixed(2),
            updatedAt: new Date(),
          })),
        },
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    console.error("Invoice creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 400 }
    );
  }
}

// export async function POST(req) {
//   const user = await currentUser();
//   if (!user) return new NextResponse("Unauthorized", { status: 401 });

//   const dbUser = await prisma.user.findUnique({
//     where: { clerkId: user.id },
//   });

//   if (!dbUser?.businessId) {
//     return new NextResponse("Business not found", { status: 404 });
//   }

//   const body = await req.json();
//   const parsed = createInvoiceSchema.safeParse(body);

//   if (!parsed.success) {
//     return NextResponse.json(parsed.error.format(), { status: 400 });
//   }

//   const { customerId, dueDate, invoiceNumber, poNumber, terms, lineItems } =
//     parsed.data;

//   const count = await prisma.invoice.count({
//     where: { businessId: dbUser.businessId },
//   });

//   const finalInvoiceNumber =
//     invoiceNumber?.trim() || `INV-${String(count + 1).padStart(4, "0")}`;

//   const amount = lineItems.reduce(
//     (sum, item) => sum + item.quantity * item.rate,
//     0
//   );

//   try {
//     const invoice = await prisma.invoice.create({
//       data: {
//         number: finalInvoiceNumber,
//         amount,
//         dueDate: new Date(dueDate),
//         status: "DRAFT",
//         businessId: dbUser.businessId,
//         customerId,
//         LineItem: {
//           create: lineItems.map((item) => ({
//             name: item.name,
//             description: item.description ?? "",
//             unit: item.unit,
//             quantity: item.quantity,
//             rate: item.rate,
//             total: item.quantity * item.rate,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//           })),
//         },
//       },
//       include: {
//         customer: true,
//         LineItem: true,
//       },
//     });

//     return NextResponse.json(invoice, { status: 201 });
//   } catch (error) {
//     console.error("❌ Failed to create invoice:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

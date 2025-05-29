// app>api>invoices>route.js

import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { invoiceSchema } from "@/lib/schemas/invoice"; // ✅ imported

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { business: true },
    });
    if (!dbUser?.businessId)
      return new NextResponse("No associated business", { status: 404 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSizeParam = searchParams.get("pageSize") || "10";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "invoiceDate_desc";

    const pageSize =
      pageSizeParam === "all" ? undefined : parseInt(pageSizeParam);
    const skip = pageSize ? (page - 1) * pageSize : undefined;

    const where = {
      businessId: dbUser.businessId,
      deleted: false,
      OR: [
        { number: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
      ],
    };

    const [sortField, sortOrder] = sort.split("_");
    let orderBy;
    if (sortField === "customer") {
      orderBy = { customer: { name: sortOrder } };
    } else if (sortField === "business") {
      orderBy = { business: { name: sortOrder } };
    } else {
      orderBy = { [sortField]: sortOrder };
    }

    const total = await prisma.invoice.count({ where });

    let rawInvoices = await prisma.invoice.findMany({
      where,
      include: { customer: true },
      orderBy:
        sortField === "customer"
          ? { customer: { name: sortOrder } }
          : sortField === "business"
            ? { business: { name: sortOrder } }
            : sortField !== "balanceDue"
              ? { [sortField]: sortOrder }
              : undefined, // skip orderBy for balanceDue
      skip,
      take: pageSize,
    });

    // Add balanceDue manually if sorting on it
    let invoices = rawInvoices.map((inv) => ({
      ...inv,
      balanceDue: parseFloat(inv.amount) - (parseFloat(inv.amountPaid) || 0),
    }));

    // Sort in-memory if needed
    if (sortField === "balanceDue") {
      invoices.sort((a, b) =>
        sortOrder === "asc"
          ? a.balanceDue - b.balanceDue
          : b.balanceDue - a.balanceDue
      );
    }

    return NextResponse.json({ invoices, total });
  } catch (err) {
    console.error("Error in GET /api/invoices:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
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

  // Step 2: Check plan tier limits
  const business = await prisma.business.findUnique({
    where: { id: dbUser.businessId },
    include: { invoices: true },
  });

  const currentCount = await prisma.invoice.count({
    where: {
      businessId: business.id,
      deleted: false,
    },
  });

  const planLimits = {
    FREE: 10,
    BASIC: 50,
    PRO: Infinity,
    ENTERPRISE: Infinity,
  };

  const maxInvoices = planLimits[business.plan];
  if (currentCount >= maxInvoices) {
    return new NextResponse("Invoice limit reached for your plan", {
      status: 403,
    });
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

    if (data.status !== "DRAFT" && !data.customerId) {
      return new NextResponse("Missing customer", { status: 400 });
    }

    if (data.status !== "DRAFT" && (!data.items || data.items.length === 0)) {
      return new NextResponse("Invoice must have at least one item", {
        status: 400,
      });
    }

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

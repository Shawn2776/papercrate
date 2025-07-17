//  app/api/customers/[id]/route.js

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getCustomerIdFromUrl } from "@/lib/functions/url/getProductIdFromUrl";

export async function GET(req) {
  const id = getCustomerIdFromUrl(req);
  if (!id) {
    return new NextResponse("Invalid customer ID", { status: 400 });
  }

  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  if (!dbUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id,
      businessId: dbUser.businessId,
    },
  });

  if (!customer) {
    return new NextResponse("Customer not found", { status: 404 });
  }

  return NextResponse.json(customer);
}
export async function PATCH(req) {
  const id = getCustomerIdFromUrl(req);
  if (!id) {
    return new NextResponse("Invalid customer ID", { status: 400 });
  }

  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id,
      businessId: dbUser.businessId,
    },
  });

  if (!customer) {
    return new NextResponse("Customer not found", { status: 404 });
  }

  const data = await req.json();

  // Optional: Add validation here using Zod or basic checks
  const { name, email, phone, addressLine1, addressLine2, city, state, postalCode, country, notes } = data;

  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        notes,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

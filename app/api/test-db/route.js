// app/api/test-db/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const businesses = await prisma.business.findMany();
    return NextResponse.json({ success: true, data: businesses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

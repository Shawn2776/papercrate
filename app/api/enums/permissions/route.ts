import { NextResponse } from "next/server";
import { Permission } from "@prisma/client";

export async function GET() {
  const permissions = Object.values(Permission);
  return NextResponse.json(permissions);
}

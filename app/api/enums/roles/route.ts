// app/api/enums/roles/route.ts
import { NextResponse } from "next/server";
import { Role } from "@prisma/client"; // ✅ Import the Role enum directly

export async function GET() {
  const roles = Object.values(Role); // ✅ Use the imported enum
  return NextResponse.json(roles);
}

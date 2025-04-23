// lib/functions/getTenantIdFromUrl.ts
import { NextRequest } from "next/server";

export function getTenantIdFromUrl(req: NextRequest): string | null {
  const segments = req.nextUrl.pathname.split("/");
  const index = segments.indexOf("tenants");

  if (index !== -1 && segments.length > index + 1) {
    return segments[index + 1];
  }

  return null;
}

// lib/functions/getUserIdFromUrl.ts
import { NextRequest } from "next/server";

export function getUserIdFromUrl(req: NextRequest): string | null {
  const segments = req.nextUrl.pathname.split("/");
  const usersIndex = segments.indexOf("users");

  if (usersIndex !== -1 && segments.length > usersIndex + 1) {
    return segments[usersIndex + 1];
  }

  return null;
}

import { NextRequest } from "next/server";

export function getInvoiceIdFromUrl(req: NextRequest): string | null {
  const segments = req.nextUrl.pathname.split("/");
  const invoicesIndex = segments.indexOf("invoices");

  if (invoicesIndex !== -1 && segments.length > invoicesIndex + 1) {
    return segments[invoicesIndex + 1];
  }

  return null;
}

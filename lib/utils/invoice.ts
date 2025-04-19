import { Tenant } from "@prisma/client";
import { prisma } from "../db/prisma";

/**
 * Resets tenant invoiceCounter if `autoResetYearly` is enabled and it's a new year.
 */
export async function getUpdatedTenantCounter(tenant: Tenant): Promise<number> {
  const currentYear = new Date().getFullYear();

  if (tenant.autoResetYearly && tenant.lastResetYear !== currentYear) {
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        invoiceCounter: 1,
        lastResetYear: currentYear,
      },
    });
    return 1;
  }

  return tenant.invoiceCounter ?? 1;
}

/**
 * Generates an invoice number based on the tenant’s format settings
 */
export function generateInvoiceNumber(tenant: Tenant): string {
  const prefix = tenant.invoicePrefix ?? "INV";
  const year = new Date().getFullYear();
  const paddedCounter = String(tenant.invoiceCounter ?? 1).padStart(4, "0");

  // Basic default format: INV-2024-0001
  const defaultFormat = `${prefix}-${year}-${paddedCounter}`;

  // In the future you can support dynamic formats via `tenant.invoiceFormat`
  return defaultFormat;
}

// lib/utils/normalizeNullableFields.ts
import { Customer } from "@/lib/types";

export function normalizeNullableFields(customer: Partial<Customer>): Customer {
  return {
    id: customer.id ?? 0,
    name: customer.name ?? "",
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    billingAddressLine1: customer.billingAddressLine1 ?? "",
    billingAddressLine2: customer.billingAddressLine2 ?? "",
    billingCity: customer.billingCity ?? "",
    billingState: customer.billingState ?? "",
    billingZip: customer.billingZip ?? "",
    shippingAddressLine1: customer.shippingAddressLine1 ?? "",
    shippingAddressLine2: customer.shippingAddressLine2 ?? "",
    shippingCity: customer.shippingCity ?? "",
    shippingState: customer.shippingState ?? "",
    shippingZip: customer.shippingZip ?? "",
    notes: customer.notes ?? "",
    tenantId: customer.tenantId ?? "", // 👈 default fallback
    deleted: customer.deleted ?? false, // 👈 default fallback
  };
}

// lib/types/types.ts

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;

  billingAddressLine1: string;
  billingAddressLine2?: string;
  billingCity: string;
  billingState: string;
  billingZip: string;

  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;

  notes?: string;

  tenantId: string;
  deleted: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Discount {
  id: number;
  name: string;
  discountValue: number;
}

export interface TaxRate {
  id: number;
  name: string;
  rate: number;
}

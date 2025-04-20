export type NormalizedCustomer = {
  id: number;
  name: string;
  email: string;
  phone: string;

  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingState: string;
  billingZip: string;

  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;

  notes: string;
  tenantId: string;
  deleted: boolean;

  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  updatedById: string;
};

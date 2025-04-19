import { Product } from "@prisma/client";

export type ExtendedProduct = {
  id: number;
  name: string;
  price?: number; // Converted from Prisma's Decimal
  sku?: string;
  barcode?: string;
  createdAt?: Date | string;
  // Add other fields if needed
};

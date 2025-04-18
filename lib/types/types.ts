// lib/types/types.ts

export interface Customer {
  id: number;
  name: string;
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

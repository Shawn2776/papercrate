// lib/redux/slices/productsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

// Define the product type
export interface Product {
  id: number;
  name: string;
  price: number;
  sku?: string;
  barcode?: string;
  imageUrl?: string;
  description?: string;
  createdAt?: string | Date;
}

// Define the state
interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const raw = await res.json();

    // Safely transform to typed Product[]
    const products: Product[] = raw.map((item: unknown) => {
      const parsed = item as {
        id: number;
        name: string;
        price: number | { toFixed: (n: number) => string };
        sku?: string;
        barcode?: string;
        imageUrl?: string;
        description?: string;
      };

      return {
        id: parsed.id,
        name: parsed.name,
        price:
          typeof parsed.price === "number"
            ? parsed.price
            : Number(parsed.price.toFixed(2)),
        sku: parsed.sku,
        barcode: parsed.barcode,
        imageUrl: parsed.imageUrl,
        description: parsed.description,
      };
    });

    return products;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      });
  },
});

export const { addProduct } = productsSlice.actions;

// Selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductsLoading = (state: RootState) =>
  state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;

export default productsSlice.reducer;

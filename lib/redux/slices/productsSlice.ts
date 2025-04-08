import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/lib/schemas";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";

// Async thunk
export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// State type
interface ProductsState {
  data: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  data: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.data = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.data.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ✅ Selectors
export const selectProducts = (state: RootState) => state.products.data;
export const selectProductsLoading = (state: RootState) =>
  state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;

// Export reducer + actions
export const { setProducts, addProduct } = productsSlice.actions;
export default productsSlice.reducer;

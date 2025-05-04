import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    return data;
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, thunkAPI) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(productData),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to create product");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`/api/product/${id}`);
      if (!res.ok) throw new Error("Product not found");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const editProduct = createAsyncThunk(
  "product/edit",
  async ({ id, updates }, thunkAPI) => {
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to edit product");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }
        state.loading = false;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default productsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async fetch
export const fetchInvoices = createAsyncThunk("invoices/fetch", async () => {
  const res = await fetch("/api/invoices");
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
});

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default invoicesSlice.reducer;

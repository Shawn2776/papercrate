import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchInvoices = createAsyncThunk(
  "invoices/fetchInvoices",
  async () => {
    const res = await fetch("/api/invoices");
    const data = await res.json();
    return data;
  }
);

// ✅ New thunk with query params
export const queryInvoices = createAsyncThunk(
  "invoices/query",
  async ({
    page = 1,
    pageSize = 10,
    search = "",
    sort = "invoiceDate_desc",
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search,
      sort,
    });

    const res = await fetch(`/api/invoices?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch invoices");
    return res.json(); // returns { invoices, total }
  }
);

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
    query: {
      page: 1,
      pageSize: 10,
      search: "",
      sort: "invoiceDate_desc",
    },
  },
  reducers: {
    setInvoiceQuery(state, action) {
      state.query = { ...state.query, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(queryInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(queryInvoices.fulfilled, (state, action) => {
        state.items = action.payload.invoices;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(queryInvoices.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setInvoiceQuery } = invoicesSlice.actions;
export default invoicesSlice.reducer;

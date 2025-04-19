// lib/redux/slices/invoicesSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

// Raw data returned from the API
interface InvoiceApiResponse {
  id: string;
  number: string;
  status: string;
  amount: number;
  customer: {
    name: string;
  } | null;
  createdAt: string;
}

// Transformed invoice row used in the table
export interface Invoice {
  id: string;
  number: string;
  status: string;
  amount: string; // Formatted currency string
  customer: string;
  createdAt: string;
}

interface InvoicesState {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
}

const initialState: InvoicesState = {
  invoices: [],
  loading: false,
  error: null,
};

export const fetchInvoices = createAsyncThunk<
  Invoice[], // return type
  void, // argument
  { rejectValue: string }
>("invoices/fetchInvoices", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/invoices");
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data: InvoiceApiResponse[] = await res.json();

    const transformed: Invoice[] = data.map((inv) => ({
      id: inv.id,
      number: inv.number,
      status: inv.status,
      amount: formatCurrency(inv.amount),
      customer: inv.customer?.name || "Unknown",
      createdAt: inv.createdAt,
    }));

    return transformed;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    addInvoice(state, action: PayloadAction<Invoice>) {
      state.invoices.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload;
        state.loading = false;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch invoices";
      });
  },
});

export const { addInvoice } = invoicesSlice.actions;

export const selectInvoices = (state: RootState) => state.invoices.invoices;
export const selectInvoicesLoading = (state: RootState) =>
  state.invoices.loading;
export const selectInvoicesError = (state: RootState) => state.invoices.error;

export default invoicesSlice.reducer;

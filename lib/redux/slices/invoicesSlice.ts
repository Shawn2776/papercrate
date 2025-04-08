import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";
import { formatCurrency } from "@/lib/functions/formatCurrency";

export interface Invoice {
  id: string;
  number: string;
  status: string;
  amount: string;
  customer: string;
  createdAt: string;
}

const initialState: Invoice[] = [];

export const fetchInvoices = createAsyncThunk<
  Invoice[],
  void,
  { rejectValue: string }
>("invoices/fetchInvoices", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/invoices");
    if (!res.ok) throw new Error(await res.text());

    const rawData = await res.json();
    const transformed: Invoice[] = rawData.map((inv: any) => ({
      id: inv.id,
      status: inv.status,
      number: inv.number,
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvoices.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export const selectInvoices = (state: RootState) => state.invoices;
export default invoicesSlice.reducer;

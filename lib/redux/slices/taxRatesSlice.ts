// lib/redux/slices/taxRatesSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

// Define the TaxRate interface
export interface TaxRate {
  id: number;
  name: string;
  rate: number;
}

interface TaxRatesState {
  taxRates: TaxRate[];
  loading: boolean;
  error: string | null;
}

const initialState: TaxRatesState = {
  taxRates: [],
  loading: false,
  error: null,
};

export const fetchTaxRates = createAsyncThunk<
  TaxRate[], // return type
  void, // argument
  { rejectValue: string }
>("taxRates/fetchTaxRates", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/tax-rates");
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data: TaxRate[] = await res.json();
    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const taxRatesSlice = createSlice({
  name: "taxRates",
  initialState,
  reducers: {
    setTaxRates(state, action: PayloadAction<TaxRate[]>) {
      state.taxRates = action.payload;
    },
    addTaxRate(state, action: PayloadAction<TaxRate>) {
      state.taxRates.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxRates.fulfilled, (state, action) => {
        state.taxRates = action.payload;
        state.loading = false;
      })
      .addCase(fetchTaxRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch tax rates";
      });
  },
});

export const { setTaxRates, addTaxRate } = taxRatesSlice.actions;

export const selectTaxRates = (state: RootState) => state.taxRates.taxRates;
export const selectTaxRatesLoading = (state: RootState) =>
  state.taxRates.loading;
export const selectTaxRatesError = (state: RootState) => state.taxRates.error;

export default taxRatesSlice.reducer;

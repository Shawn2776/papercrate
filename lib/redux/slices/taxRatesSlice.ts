import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TaxRate } from "@/lib/schemas";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";

// Async thunk
export const fetchTaxRates = createAsyncThunk<TaxRate[]>(
  "taxRates/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/tax-rates");
      if (!res.ok) throw new Error(`Failed to fetch tax rates (${res.status})`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// Slice state
interface TaxRatesState {
  data: TaxRate[];
  loading: boolean;
  error: string | null;
}

const initialState: TaxRatesState = {
  data: [],
  loading: false,
  error: null,
};

const taxRatesSlice = createSlice({
  name: "taxRates",
  initialState,
  reducers: {
    setTaxRates: (state, action: PayloadAction<TaxRate[]>) => {
      state.data = action.payload;
    },
    addTaxRate: (state, action: PayloadAction<TaxRate>) => {
      state.data.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxRates.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTaxRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ✅ Selectors
export const selectTaxRates = (state: RootState) => state.taxRates.data;
export const selectTaxRatesLoading = (state: RootState) =>
  state.taxRates.loading;
export const selectTaxRatesError = (state: RootState) => state.taxRates.error;

export const { setTaxRates, addTaxRate } = taxRatesSlice.actions;
export default taxRatesSlice.reducer;

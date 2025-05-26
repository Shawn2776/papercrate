import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all tax rates
export const fetchTaxRates = createAsyncThunk("taxRates/fetch", async () => {
  const res = await fetch("/api/tax-rates");
  if (!res.ok) throw new Error("Failed to load tax rates");
  return res.json();
});

// Create new tax rate
export const createTaxRate = createAsyncThunk(
  "taxRates/create",
  async (taxRateData, thunkAPI) => {
    try {
      const res = await fetch("/api/tax-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taxRateData),
      });
      if (!res.ok) throw new Error("Failed to create tax rate");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const taxRatesSlice = createSlice({
  name: "taxRates",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxRates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaxRates.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTaxRates.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      .addCase(createTaxRate.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTaxRate.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createTaxRate.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default taxRatesSlice.reducer;

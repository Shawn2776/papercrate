import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Discount } from "@/lib/schemas";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";

// Async thunk to fetch discounts
export const fetchDiscounts = createAsyncThunk<Discount[]>(
  "discounts/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/discounts");
      if (!res.ok) throw new Error(`Failed to fetch discounts (${res.status})`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// State definition
interface DiscountsState {
  data: Discount[];
  loading: boolean;
  error: string | null;
}

const initialState: DiscountsState = {
  data: [],
  loading: false,
  error: null,
};

const discountsSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {
    setDiscounts: (state, action: PayloadAction<Discount[]>) => {
      state.data = action.payload;
    },
    addDiscount: (state, action: PayloadAction<Discount>) => {
      state.data.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ✅ Selectors
export const selectDiscounts = (state: RootState) => state.discounts.data;
export const selectDiscountsLoading = (state: RootState) =>
  state.discounts.loading;
export const selectDiscountsError = (state: RootState) => state.discounts.error;

// Export actions + reducer
export const { setDiscounts, addDiscount } = discountsSlice.actions;
export default discountsSlice.reducer;

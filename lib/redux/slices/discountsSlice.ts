// lib/redux/slices/discountsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";

// Discount model type
export interface Discount {
  id: number;
  name: string;
  discountValue: number;
}

// Slice state
interface DiscountsState {
  discounts: Discount[];
  loading: boolean;
  error: string | null;
}

const initialState: DiscountsState = {
  discounts: [],
  loading: false,
  error: null,
};

// Async thunk to fetch discounts
export const fetchDiscounts = createAsyncThunk<
  Discount[],
  void,
  { rejectValue: string }
>("discounts/fetchDiscounts", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/discounts");
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const discountsSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {
    addDiscount(state, action: PayloadAction<Discount>) {
      state.discounts.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.discounts = action.payload;
        state.loading = false;
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch discounts";
      });
  },
});

export const { addDiscount } = discountsSlice.actions;

// Selectors
export const selectDiscounts = (state: RootState) => state.discounts.discounts;
export const selectDiscountsLoading = (state: RootState) =>
  state.discounts.loading;
export const selectDiscountsError = (state: RootState) => state.discounts.error;

export default discountsSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";

// Change this to enum if needed
export type InvoiceStatus = string;

// Async thunk to fetch statuses
export const fetchStatuses = createAsyncThunk<InvoiceStatus[]>(
  "statuses/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/enums/invoice-status");
      if (!res.ok) throw new Error(`Failed to fetch statuses (${res.status})`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

interface StatusesState {
  data: InvoiceStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: StatusesState = {
  data: [],
  loading: false,
  error: null,
};

const statusesSlice = createSlice({
  name: "statuses",
  initialState,
  reducers: {
    setStatuses: (state, action: PayloadAction<InvoiceStatus[]>) => {
      state.data = action.payload;
    },
    addStatus: (state, action: PayloadAction<InvoiceStatus>) => {
      if (!state.data.includes(action.payload)) {
        state.data.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ✅ Selectors
export const selectStatuses = (state: RootState) => state.statuses.data;
export const selectStatusesLoading = (state: RootState) =>
  state.statuses.loading;
export const selectStatusesError = (state: RootState) => state.statuses.error;

export const { setStatuses, addStatus } = statusesSlice.actions;
export default statusesSlice.reducer;

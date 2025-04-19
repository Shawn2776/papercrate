import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

// Define type for each status string (or use an enum if you prefer)
export type InvoiceStatus = string;

interface StatusesState {
  items: InvoiceStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: StatusesState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to fetch statuses
export const fetchStatuses = createAsyncThunk<
  InvoiceStatus[],
  void,
  { rejectValue: string }
>("statuses/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/enums/invoice-status");
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const data: InvoiceStatus[] = await res.json();
    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// Slice
const statusesSlice = createSlice({
  name: "statuses",
  initialState,
  reducers: {
    setStatuses: (state, action: PayloadAction<InvoiceStatus[]>) => {
      state.items = action.payload;
    },
    addStatus: (state, action: PayloadAction<InvoiceStatus>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
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
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch statuses";
      });
  },
});

// Exports
export const { setStatuses, addStatus } = statusesSlice.actions;
export const selectStatuses = (state: RootState) => state.statuses.items;
export const selectStatusesLoading = (state: RootState) =>
  state.statuses.loading;
export const selectStatusesError = (state: RootState) => state.statuses.error;

export default statusesSlice.reducer;

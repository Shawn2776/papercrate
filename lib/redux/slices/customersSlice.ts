import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "@/lib/schemas";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";

// Async thunk to fetch customers
export const fetchCustomers = createAsyncThunk<Customer[]>(
  "customers/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/customers");
      if (!res.ok) throw new Error(`Failed to fetch customers (${res.status})`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// Slice state type
interface CustomersState {
  data: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  data: [],
  loading: false,
  error: null,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.data = action.payload;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.data.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ✅ Selectors
export const selectCustomers = (state: RootState) => state.customers.data;
export const selectCustomersLoading = (state: RootState) =>
  state.customers.loading;
export const selectCustomersError = (state: RootState) => state.customers.error;

// Actions + reducer
export const { setCustomers, addCustomer } = customersSlice.actions;
export default customersSlice.reducer;

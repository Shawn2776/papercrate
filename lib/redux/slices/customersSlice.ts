import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "@/lib/schemas";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/functions/getErrorMessage";

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

export const fetchCustomers = createAsyncThunk<
  Customer[],
  void,
  { rejectValue: string }
>("customers/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/customers");
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
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
        state.error = action.payload ?? "Failed to load customers";
      });
  },
});

export const { addCustomer } = customersSlice.actions;
export const selectCustomers = (state: RootState) => state.customers.data;
export const selectCustomersLoading = (state: RootState) =>
  state.customers.loading;
export const selectCustomersError = (state: RootState) => state.customers.error;

export default customersSlice.reducer;

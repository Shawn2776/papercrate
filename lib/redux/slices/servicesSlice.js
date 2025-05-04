import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchServices = createAsyncThunk(
  "customers/fetchCustomers",
  async () => {
    const res = await fetch("/api/customers");
    const data = await res.json();
    return data;
  }
);

export const createCustomer = createAsyncThunk(
  "customers/create",
  async (customerData, thunkAPI) => {
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        body: JSON.stringify(customerData),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to create customer");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  "customers/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`/api/customers/${id}`);
      if (!res.ok) throw new Error("Customer not found");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const editCustomer = createAsyncThunk(
  "customers/edit",
  async ({ id, updates }, thunkAPI) => {
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to edit customer");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(editCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(editCustomer.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }
        state.loading = false;
      })
      .addCase(editCustomer.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default customersSlice.reducer;

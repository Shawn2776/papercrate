import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async () => {
    const res = await fetch("/api/services");
    const data = await res.json();
    return data;
  }
);

export const createService = createAsyncThunk(
  "services/create",
  async (serviceData, thunkAPI) => {
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        body: JSON.stringify(serviceData),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to create service");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  "services/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`/api/services/${id}`);
      if (!res.ok) throw new Error("Service not found");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const editService = createAsyncThunk(
  "services/edit",
  async ({ id, updates }, thunkAPI) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to edit service");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const servicesSlice = createSlice({
  name: "services",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(createService.pending, (state) => {
        state.loading = true;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createService.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(editService.pending, (state) => {
        state.loading = true;
      })
      .addCase(editService.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }
        state.loading = false;
      })
      .addCase(editService.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default servicesSlice.reducer;

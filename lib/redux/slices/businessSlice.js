import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBusiness = createAsyncThunk(
  "business/fetchBusiness",
  async () => {
    const res = await fetch("/api/business");
    const data = await res.json();
    return data;
  }
);

export const createBusiness = createAsyncThunk(
  "business/create",
  async (businessData, thunkAPI) => {
    try {
      const res = await fetch("/api/business", {
        method: "POST",
        body: JSON.stringify(businessData),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to create business");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchBusinessById = createAsyncThunk(
  "business/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`/api/business/${id}`);
      if (!res.ok) throw new Error("Business not found");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const editBusiness = createAsyncThunk(
  "business/edit",
  async ({ id, updates }, thunkAPI) => {
    try {
      const res = await fetch(`/api/business/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to edit business");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const businessSlice = createSlice({
  name: "business",
  initialState: {
    item: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusiness.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusiness.fulfilled, (state, action) => {
        state.item = action.payload;
        state.loading = false;
      })
      .addCase(fetchBusiness.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default businessSlice.reducer;

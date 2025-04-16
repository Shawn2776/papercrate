import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type EnumGroup = {
  [enumValue: string]: string; // for future inline editing
};

export type AdminEnumsState = {
  enums: {
    [groupName: string]: EnumGroup;
  };
  loading: boolean;
  error: string | null;
};

const initialState: AdminEnumsState = {
  enums: {},
  loading: false,
  error: null,
};

export const fetchAdminEnums = createAsyncThunk<
  { [key: string]: string[] }, // response shape
  void,
  { state: RootState }
>("adminEnums/fetch", async () => {
  const res = await fetch("/api/admin/enums");
  if (!res.ok) throw new Error("Failed to fetch enums");
  return res.json();
});

const adminEnumsSlice = createSlice({
  name: "adminEnums",
  initialState,
  reducers: {
    updateEnumValue: (
      state,
      action: PayloadAction<{
        group: string;
        oldValue: string;
        newValue: string;
      }>
    ) => {
      const { group, oldValue, newValue } = action.payload;
      if (state.enums[group]) {
        const value = state.enums[group][oldValue];
        delete state.enums[group][oldValue];
        state.enums[group][newValue] = value ?? newValue;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminEnums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminEnums.fulfilled, (state, action) => {
        state.loading = false;
        const result = action.payload;
        const normalized: { [key: string]: EnumGroup } = {};
        for (const group in result) {
          normalized[group] = {};
          for (const value of result[group]) {
            normalized[group][value] = value;
          }
        }
        state.enums = normalized;
      })
      .addCase(fetchAdminEnums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load enums";
      });
  },
});

export const { updateEnumValue } = adminEnumsSlice.actions;
export const selectAdminEnums = (state: RootState) => state.adminEnums;

export default adminEnumsSlice.reducer;

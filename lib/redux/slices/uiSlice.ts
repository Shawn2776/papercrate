import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tenant } from "@prisma/client";

type UIState = {
  selectedTenant: Tenant | null;
};

const initialState: UIState = {
  selectedTenant: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedTenant: (state, action: PayloadAction<Tenant>) => {
      state.selectedTenant = action.payload;
    },
    clearSelectedTenant: (state) => {
      state.selectedTenant = null;
    },
  },
});

export const { setSelectedTenant, clearSelectedTenant } = uiSlice.actions;
export const selectSelectedTenant = (state: { ui: UIState }) =>
  state.ui.selectedTenant;

export default uiSlice.reducer;

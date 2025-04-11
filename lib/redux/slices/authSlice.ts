// lib/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role, Permission } from "@/lib/constants/permissions";

type AuthState = {
  role: Role | null;
  permissions: Permission[];
  loading: boolean;
};

const initialState: AuthState = {
  role: null,
  permissions: [],
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{
        role: Role | null;
        permissions: Permission[];
        loading: true;
      }>
    ) {
      state.role = action.payload.role;
      state.permissions = action.payload.permissions;
      state.loading = action.payload.loading;
    },
  },
});

export const { setAuth } = authSlice.actions;

export const selectUserRole = (state: { auth: AuthState }) => state.auth.role;
export const selectUserPermissions = (state: { auth: AuthState }) =>
  state.auth.permissions;

export default authSlice.reducer;

// lib/redux/slices/authSlice.ts
import { Permission, Role } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        loading: boolean;
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

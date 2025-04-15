// lib/redux/slices/authSlice.ts
import { Permission, Role } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  role: Role | null;
  permissions: Permission[];
  loading: boolean;
  hasTenant: boolean;
};

const initialState: AuthState = {
  role: null,
  permissions: [],
  loading: true,
  hasTenant: false,
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
        hasTenant: boolean;
      }>
    ) {
      state.role = action.payload.role;
      state.permissions = action.payload.permissions;
      state.loading = action.payload.loading;
      state.hasTenant = action.payload.hasTenant;
    },
  },
});

export const { setAuth } = authSlice.actions;

export const selectUserRole = (state: { auth: AuthState }) => state.auth.role;
export const selectUserPermissions = (state: { auth: AuthState }) =>
  state.auth.permissions;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;

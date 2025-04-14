// lib/redux/slices/adminUsersSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/utils/localStorage";

export type AdminUser = {
  id: string;
  email: string;
  name?: string;
  role: string;
  deleted: boolean;
  isTenantOwner: boolean;
  memberships: {
    tenantName: string;
    role: string;
  }[];
};

export type AdminUserState = {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  filter: "active" | "deleted" | "all";
  page: number;
  pageSize: number;
  total: number;
};

type FetchUsersResponse = {
  users: AdminUser[];
  total: number;
};

// default filter config (can be adjusted later)
const defaultPersisted = {
  filter: "active" as "active" | "deleted" | "all",
  page: 1,
  pageSize: 10,
};

const persisted = loadFromLocalStorage<Partial<AdminUserState>>(
  "adminUser",
  defaultPersisted
);

const initialState: AdminUserState = {
  users: [],
  loading: false,
  error: null,
  filter: persisted.filter ?? "active",
  page: persisted.page ?? 1,
  pageSize: persisted.pageSize ?? 10,
  total: 0,
};

export const fetchAdminUsers = createAsyncThunk<
  FetchUsersResponse, // ✅ what we return
  void, // ✅ no argument
  { state: RootState } // ✅ thunkAPI.getState() type
>("adminUsers/fetchAll", async (_, thunkAPI) => {
  const { filter, page, pageSize } = thunkAPI.getState().adminUsers;

  const res = await fetch(
    `/api/admin/users?filter=${filter}&page=${page}&pageSize=${pageSize}`
  );

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
});

export const softDeleteUser = createAsyncThunk<
  string, // ✅ return userId
  string, // ✅ accepts userId as param
  { state: RootState }
>("adminUsers/softDelete", async (userId, thunkAPI) => {
  const res = await fetch(`/api/admin/users/${userId}/soft-delete`, {
    method: "PATCH",
  });

  if (!res.ok) throw new Error("Failed to soft delete user");
  return userId;
});

export const restoreUser = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("adminUsers/restore", async (userId, thunkAPI) => {
  const res = await fetch(`/api/admin/users/${userId}/restore`, {
    method: "PATCH",
  });

  if (!res.ok) throw new Error("Failed to restore user");
  return userId;
});

export const hardDeleteUser = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("adminUsers/hardDelete", async (userId, thunkAPI) => {
  const res = await fetch(`/api/admin/users/${userId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to hard delete user");
  return userId;
});

export const updateUser = createAsyncThunk<
  AdminUser, // what it returns
  { id: string; data: Partial<Pick<AdminUser, "name" | "role">> }, // args
  { state: RootState }
>("adminUsers/update", async ({ id, data }) => {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
});

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<AdminUserState["filter"]>) {
      state.filter = action.payload;
      saveToLocalStorage("adminUser", {
        ...state,
        filter: action.payload,
      });
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
      saveToLocalStorage("adminUser", {
        ...state,
        page: action.payload,
      });
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      saveToLocalStorage("adminUser", {
        ...state,
        pageSize: action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // 👉 Fetch users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      // 👉 Soft delete user
      .addCase(softDeleteUser.fulfilled, (state, action) => {
        const id = action.payload;
        const user = state.users.find((u) => u.id === id);
        if (user) user.deleted = true;
      })

      // 👉 Restore user
      .addCase(restoreUser.fulfilled, (state, action) => {
        const id = action.payload;
        const user = state.users.find((u) => u.id === id);
        if (user) user.deleted = false;
      })

      // 👉 Hard delete user
      .addCase(hardDeleteUser.fulfilled, (state, action) => {
        const id = action.payload;
        state.users = state.users.filter((u) => u.id !== id);
        state.total = state.total - 1;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.users.findIndex((u) => u.id === updated.id);
        if (index !== -1) {
          state.users[index] = updated;
        }
      });
  },
});

export const { setFilter, setPage, setPageSize } = adminUsersSlice.actions;

export const selectAdminUsers = (state: RootState) => state.adminUsers;

export default adminUsersSlice.reducer;

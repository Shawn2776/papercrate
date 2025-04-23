import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/utils/localStorage";
import { AdminUser } from "./adminUsersSlice";
import { Customer, Invoice, Product } from "@prisma/client";

// 👇 Match your DB/API shape
export type AdminTenant = {
  id: string;
  name: string;
  deleted: boolean;
  userCount: number;
  plan: string;
  createdAt: string;
};

export type ExpandedTenantData = {
  users: AdminUser[];
  invoices: Invoice[];
  customers: Customer[];
  products: Product[];
};

export type AdminTenantState = {
  tenants: AdminTenant[];
  loading: boolean;
  error: string | null;
  filter: "active" | "deleted" | "all";
  page: number;
  pageSize: number;
  total: number;
  selectedTenant: AdminTenant | null;
  expandedTenantData: ExpandedTenantData | null;
};

export const fetchTenantDetails = createAsyncThunk<
  ExpandedTenantData,
  string,
  { state: RootState }
>("adminTenants/fetchDetails", async (tenantId) => {
  const res = await fetch(`/api/admin/tenants/${tenantId}/full`);
  if (!res.ok) throw new Error("Failed to fetch tenant details");
  const data = await res.json();

  return {
    users: data.users,
    invoices: data.invoices,
    customers: data.customers,
    products: data.products,
  };
});

type FetchTenantsResponse = {
  tenants: AdminTenant[];
  total: number;
};

const defaultPersisted = {
  filter: "active" as "active" | "deleted" | "all",
  page: 1,
  pageSize: 10,
};

const persisted = loadFromLocalStorage<Partial<AdminTenantState>>(
  "adminTenant",
  defaultPersisted
);

const initialState: AdminTenantState = {
  tenants: [],
  loading: false,
  error: null,
  filter: persisted.filter ?? "active",
  page: persisted.page ?? 1,
  pageSize: persisted.pageSize ?? 10,
  total: 0,
  selectedTenant: null,
  expandedTenantData: null,
};

// 🔄 Async Thunks
export const fetchAdminTenants = createAsyncThunk<
  FetchTenantsResponse,
  void,
  { state: RootState }
>("adminTenants/fetchAll", async (_, thunkAPI) => {
  const { filter, page, pageSize } = thunkAPI.getState().adminTenants;

  const res = await fetch(
    `/api/admin/tenants?filter=${filter}&page=${page}&pageSize=${pageSize}`
  );

  if (!res.ok) throw new Error("Failed to fetch tenants");
  return res.json();
});

export const softDeleteTenant = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("adminTenants/softDelete", async (tenantId) => {
  const res = await fetch(`/api/admin/tenants/${tenantId}/soft-delete`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to soft delete tenant");
  return tenantId;
});

export const restoreTenant = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("adminTenants/restore", async (tenantId) => {
  const res = await fetch(`/api/admin/tenants/${tenantId}/restore`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to restore tenant");
  return tenantId;
});

export const hardDeleteTenant = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("adminTenants/hardDelete", async (tenantId) => {
  const res = await fetch(`/api/admin/tenants/${tenantId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to hard delete tenant");
  return tenantId;
});

export const updateTenant = createAsyncThunk<
  AdminTenant,
  { id: string; data: Partial<Pick<AdminTenant, "name">> },
  { state: RootState }
>("adminTenants/update", async ({ id, data }) => {
  const res = await fetch(`/api/admin/tenants/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update tenant");
  return res.json();
});

// 🧠 Slice
const adminTenantsSlice = createSlice({
  name: "adminTenants",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<AdminTenantState["filter"]>) {
      state.filter = action.payload;
      saveToLocalStorage("adminTenant", {
        ...state,
        filter: action.payload,
      });
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
      saveToLocalStorage("adminTenant", {
        ...state,
        page: action.payload,
      });
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      saveToLocalStorage("adminTenant", {
        ...state,
        pageSize: action.payload,
      });
    },
    setSelectedTenant(state, action: PayloadAction<AdminTenant>) {
      state.selectedTenant = action.payload;
    },
    clearSelectedTenant(state) {
      state.selectedTenant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload.tenants;
        state.total = action.payload.total;
      })
      .addCase(fetchAdminTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tenants";
      })
      .addCase(softDeleteTenant.fulfilled, (state, action) => {
        const id = action.payload;
        const tenant = state.tenants.find((t) => t.id === id);
        if (tenant) tenant.deleted = true;
      })
      .addCase(restoreTenant.fulfilled, (state, action) => {
        const id = action.payload;
        const tenant = state.tenants.find((t) => t.id === id);
        if (tenant) tenant.deleted = false;
      })
      .addCase(hardDeleteTenant.fulfilled, (state, action) => {
        const id = action.payload;
        state.tenants = state.tenants.filter((t) => t.id !== id);
        state.total = state.total - 1;
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.tenants.findIndex((t) => t.id === updated.id);
        if (index !== -1) {
          state.tenants[index] = updated;
        }
      })
      .addCase(fetchTenantDetails.fulfilled, (state, action) => {
        state.expandedTenantData = action.payload;
      });
  },
});

// ✅ Export actions + selectors
export const {
  setFilter,
  setPage,
  setPageSize,
  setSelectedTenant,
  clearSelectedTenant,
} = adminTenantsSlice.actions;

export const selectAdminTenants = (state: RootState) => state.adminTenants;
export const selectSelectedTenant = (state: RootState) =>
  state.adminTenants.selectedTenant;
export const selectExpandedTenantData = (state: RootState) =>
  state.adminTenants.expandedTenantData;

export default adminTenantsSlice.reducer;

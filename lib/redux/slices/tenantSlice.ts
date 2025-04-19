import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { PlanTier } from "@prisma/client";

export type Tenant = {
  id: string;
  name: string;
  plan: PlanTier;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string;
  zip?: string;
  email?: string;
  website?: string;
  invoicePrefix?: string;
  invoiceCounter?: number;
  InvoiceSettings?: {
    primaryColor?: string;
    layout?: string;
    includeCustomerInfo?: boolean;
    includePaymentTerms?: boolean;
    includeDueDate?: boolean;
    includeNotes?: boolean;
    defaultNotes?: string;
  }[];
};

interface TenantState {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenants: [],
  currentTenant: null,
  loading: false,
  error: null,
};

export const fetchTenants = createAsyncThunk<
  Tenant[],
  void,
  { rejectValue: string }
>("tenant/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/tenant/list");
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setCurrentTenant: (state, action: PayloadAction<Tenant | null>) => {
      state.currentTenant = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload;

        const storedId = localStorage.getItem("activeTenantId");
        const found =
          action.payload.find((t) => t.id === storedId) ||
          action.payload[0] ||
          null;

        if (found) {
          state.currentTenant = found;
          localStorage.setItem("activeTenantId", found.id);
        }
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load tenants";
      });
  },
});

export const { setCurrentTenant } = tenantSlice.actions;

// Selectors
export const selectCurrentTenant = (state: RootState) =>
  state.tenant.currentTenant;
export const selectAllTenants = (state: RootState) => state.tenant.tenants;
export const selectTenantsLoading = (state: RootState) => state.tenant.loading;
export const selectTenantsError = (state: RootState) => state.tenant.error;

export default tenantSlice.reducer;

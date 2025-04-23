import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "./slices/onboardingSlice";
import productsReducer from "./slices/productsSlice";
import customersReducer from "./slices/customersSlice";
import invoicesReducer from "./slices/invoicesSlice";
import discountsReducer from "./slices/discountsSlice";
import taxRatesReducer from "./slices/taxRatesSlice";
import statusesReducer from "./slices/statusesSlice";
import authReducer from "./slices/authSlice";
import tenantReducer from "./slices/tenantSlice";
import counterReducer from "./slices/counterSlice";
import adminUsersReducer from "./slices/adminUsersSlice";
import adminEnumsReducer from "./slices/adminEnumsSlice";
import adminTenantsReducer from "./slices/adminTenantsSlice";

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    products: productsReducer,
    customers: customersReducer,
    invoices: invoicesReducer,
    discounts: discountsReducer,
    taxRates: taxRatesReducer,
    statuses: statusesReducer,
    auth: authReducer,
    tenant: tenantReducer,
    counter: counterReducer,
    adminUsers: adminUsersReducer,
    adminEnums: adminEnumsReducer,
    adminTenants: adminTenantsReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

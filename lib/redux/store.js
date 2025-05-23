import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./slices/customersSlice";
import servicesReducer from "./slices/servicesSlice";
import productsReducer from "./slices/productsSlice";
import businessReducer from "./slices/businessSlice";
import invoicesReducer from "./slices/invoicesSlice";

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    services: servicesReducer,
    products: productsReducer,
    business: businessReducer,
    invoices: invoicesReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./slices/customersSlice";
import servicesReducer from "./slices/servicesSlice";
import productsReducer from "./slices/productsSlice";

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    services: servicesReducer,
    products: productsReducer,
  },
});

import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./slices/customersSlice";

export const store = configureStore({
  reducer: {
    customers: customersReducer,
  },
});

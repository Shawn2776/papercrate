// lib/redux/slices/onboardingSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/utils/localStorage";

// Defines the shape of the business onboarding form data.
export interface FormData {
  businessType?: string;
  businessCategory?: string;
  businessSubcategory?: string;
  legalBusinessName?: string;
  doingBusinessAs?: string | null;
  ein?: string;
  businessState?: string | null;
  addressLine1?: string;
  addressLine2?: string | null;
  zip?: string;
  city?: string;
  businessEmail?: string;
  isManualEntry?: boolean;
  onlineStatus?: "online" | "notOnline";
  onlineLink?: string | null;
  tenantId?: string;
  plan?: "free" | "enhanced" | "pro" | "enterprise";
  billingCycle?: "monthly" | "annual";
}

// This is the shape of the whole Redux slice state.
interface OnboardingState {
  step: number; // tracks what step in the form you're on.
  formData: FormData; // holds all collected form data (defined above).
}

// Starting/default values when the onboarding begins.
const defaultState: OnboardingState = {
  step: 1,
  formData: {},
};

// Tries to load from local storage if available; otherwise, falls back to defaultState.
// This gives you persistence across page reloads.
const persistedState = loadFromLocalStorage<OnboardingState>(
  "onboarding",
  defaultState
);

// Merges the fallback state and anything loaded from storage.
const initialState: OnboardingState = {
  ...defaultState,
  ...persistedState,
};

// This is your actual Redux slice. It defines the name, initial state, and reducer functions.
const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    // Action handlers — what happens when you dispatch an action.
    setStep: (state, action: PayloadAction<number>) => {
      // Moves to a specific step in the form.
      state.step = action.payload;
      saveToLocalStorage("onboarding", state);
    },
    nextStep: (state) => {
      // Increments the current step.
      state.step += 1;
      saveToLocalStorage("onboarding", state);
    },
    prevStep: (state) => {
      // Decrements the current step
      state.step = Math.max(1, state.step - 1);
      saveToLocalStorage("onboarding", state);
    },
    setFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      // Updates the form data — merges partial input into the full formData. This is what you're calling on each step (dispatch(setFormData({ key: value }))).
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
      saveToLocalStorage("onboarding", state);
    },
    resetOnboarding: () => {
      // Clears onboarding progress and resets to default.
      const reset = { ...defaultState };
      saveToLocalStorage("onboarding", reset);
      return reset;
    },
  },
});

// Makes the actions and reducer available to the app.
export const { setStep, nextStep, prevStep, setFormData, resetOnboarding } =
  onboardingSlice.actions;

export default onboardingSlice.reducer;

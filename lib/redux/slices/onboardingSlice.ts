import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/utils/localStorage";

interface FormData {
  businessType?: string;
  businessCategory?: string;
  businessSubcategory?: string;
  legalBusinessName?: string;
  doingBusinessAs?: string;
  ein?: string;
  businessState?: string;
  addressLine1?: string;
  addressLine2?: string;
  zip?: string;
  city?: string;
  businessEmail?: string;
  isManualEntry?: boolean;
  onlineStatus?: "online" | "notOnline";
  onlineLink?: string;
  tenantId?: string; // optionally used later on creation
}

interface OnboardingState {
  step: number;
  formData: FormData;
}

const defaultState: OnboardingState = {
  step: 1,
  formData: {},
};

// Load persisted state if it exists
const persistedState = loadFromLocalStorage<OnboardingState>(
  "onboarding",
  defaultState
);

const initialState: OnboardingState = {
  ...defaultState,
  ...persistedState,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
      saveToLocalStorage("onboarding", state);
    },
    nextStep: (state) => {
      state.step += 1;
      saveToLocalStorage("onboarding", state);
    },
    prevStep: (state) => {
      state.step = Math.max(1, state.step - 1);
      saveToLocalStorage("onboarding", state);
    },
    setFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
      saveToLocalStorage("onboarding", state);
    },
    resetOnboarding: () => {
      const reset = { ...defaultState };
      saveToLocalStorage("onboarding", reset);
      return reset;
    },
  },
});

export const { setStep, nextStep, prevStep, setFormData, resetOnboarding } =
  onboardingSlice.actions;

export default onboardingSlice.reducer;

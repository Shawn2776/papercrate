import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const initialState: OnboardingState = {
  step: 1,
  formData: {},
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      state.step = Math.max(1, state.step - 1);
    },
    setFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },
    resetOnboarding: () => initialState,
  },
});

export const { setStep, nextStep, prevStep, setFormData, resetOnboarding } =
  onboardingSlice.actions;

export default onboardingSlice.reducer;

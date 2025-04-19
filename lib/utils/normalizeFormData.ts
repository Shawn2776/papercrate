// lib/functions/normalizeFormData.ts
import type { FormData } from "@/lib/redux/slices/onboardingSlice";

export const normalizeFormData = (
  data: Partial<FormData>
): Partial<FormData> => {
  return {
    ...data,
    doingBusinessAs:
      data.doingBusinessAs === null ? undefined : data.doingBusinessAs,
    addressLine2: data.addressLine2 === null ? undefined : data.addressLine2,
    businessEmail: data.businessEmail === null ? undefined : data.businessEmail,
    onlineLink: data.onlineLink === null ? undefined : data.onlineLink,
  };
};

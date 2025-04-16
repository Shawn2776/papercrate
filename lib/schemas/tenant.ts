import { z } from "zod";

export const TenantCreateSchema = z
  .object({
    legalBusinessName: z.string().min(2),
    businessEmail: z.string().email().optional().nullable(),
    onlineStatus: z.enum(["online", "notOnline"]),
    onlineLink: z.string().optional().nullable(), // URL validated below
    businessType: z.string(),
    businessCategory: z.string(),
    businessSubcategory: z.string(),
    doingBusinessAs: z.string().optional().nullable(), // ✅ NEW
    ein: z.string().min(2), // ✅ NEW
    isManualEntry: z.boolean().optional().default(false), // ✅ NEW
    addressLine1: z.string(),
    addressLine2: z.string().optional().nullable(),
    city: z.string(),
    businessState: z.string(),
    zip: z.string(),
  })
  .superRefine((data, ctx) => {
    // Only validate onlineLink if onlineStatus is 'online'
    if (data.onlineStatus === "online") {
      if (!data.onlineLink || data.onlineLink.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["onlineLink"],
          message: "Online link is required when status is 'online'",
        });
      } else {
        try {
          new URL(data.onlineLink);
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["onlineLink"],
            message: "Invalid URL format",
          });
        }
      }
    }
  });

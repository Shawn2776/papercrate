import { z } from "zod";

export const TenantCreateSchema = z
  .object({
    legalBusinessName: z.string().min(2),
    businessEmail: z.string().email().optional(),
    onlineStatus: z.enum(["online", "notOnline"]),
    onlineLink: z.string().optional(), // handle conditionally
    businessType: z.string(),
    businessCategory: z.string(),
    businessSubcategory: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
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
            message: "Invalid url",
          });
        }
      }
    }
  });

// lib/schemas/business.js
import { z } from "zod";

export const businessSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters long." })
    .max(100, { message: "Business name must be at most 100 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
});

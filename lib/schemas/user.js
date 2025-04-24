// lib/schemas/userSchema.js
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export const validateUser = (data) => {
  return userSchema.safeParse(data);
};

import { z } from "zod";

export const profileSchema = z.object({
  name: z
  .string()
  .trim()
  .min(1, "Name is required")
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name cannot exceed 50 characters")
  .regex(
    /^[A-Za-z\s]+$/,
    "Name can contain only letters and spaces"
  ),

  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
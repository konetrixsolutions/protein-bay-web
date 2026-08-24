import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name must not exceed 50 characters.")
      .regex(
        /^[A-Za-z]+(?:[.'-]?[A-Za-z]+)*(?:\s+[A-Za-z]+(?:[.'-]?[A-Za-z]+)*)*$/,
        "Please enter a valid name.",
      ),

    mobile: z
      .string()
      .trim()
      .regex(
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit mobile number.",
      ),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(64, "Password must not exceed 64 characters.")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter.",
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter.",
      )
      .regex(
        /\d/,
        "Password must contain at least one number.",
      )
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character.",
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),

    referralCode: z.string().optional(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export type SignupFormData =
  z.infer<typeof signupSchema>;
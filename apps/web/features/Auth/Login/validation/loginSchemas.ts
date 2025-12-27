import { z } from "zod";

export const loginEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Auth.Login.validation.email-required" })
    .email({ message: "Auth.Login.validation.email-invalid" }),
});

export type LoginEmailValues = z.infer<typeof loginEmailSchema>;

export const loginPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Auth.Login.validation.password-required" })
    .min(6, { message: "Auth.Login.validation.password-min" }),
});

export type LoginPasswordValues = z.infer<typeof loginPasswordSchema>;

export const registerProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Auth.Login.validation.username-required" })
    .min(2, { message: "Auth.Login.validation.username-min" })
    .max(64, { message: "Auth.Login.validation.username-max" }),
});

export type RegisterProfileValues = z.infer<typeof registerProfileSchema>;

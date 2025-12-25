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
    .min(8, { message: "Auth.Login.validation.password-min" }),
});

export type LoginPasswordValues = z.infer<typeof loginPasswordSchema>;

export const registerUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Auth.Login.validation.username-required" })
    .min(3, { message: "Auth.Login.validation.username-min" })
    .max(32, { message: "Auth.Login.validation.username-max" }),
  privacy: z
    .boolean()
    .refine((v) => v === true)
    .default(false),
  news: z.boolean().default(false),
});

export type RegisterUsernameValues = z.infer<typeof registerUsernameSchema>;

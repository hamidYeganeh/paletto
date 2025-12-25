import { z } from "zod";

export const loginEmailSchema = z.object({
  email: z.string().trim().email(),
});

export type LoginEmailValues = z.infer<typeof loginEmailSchema>;

export const loginPasswordSchema = z.object({
  password: z.string().min(8),
});

export type LoginPasswordValues = z.infer<typeof loginPasswordSchema>;

export const registerUsernameSchema = z.object({
  username: z.string().trim().min(3).max(32),
});

export type RegisterUsernameValues = z.infer<typeof registerUsernameSchema>;


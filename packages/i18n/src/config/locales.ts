export const locales = ["fa"] as const;

export type Locale = (typeof locales)[number];

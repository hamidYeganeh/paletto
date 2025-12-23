import { defaultLocale } from "../config/defaultLocale";
import { locales, type Locale } from "../config/locales";

type ResolveLocaleInput = {
  locale?: string | null;
  acceptLanguage?: string | null;
};

function normalizeLocale(value: string): string {
  return value.trim().toLowerCase().replace("_", "-");
}

function parseAcceptLanguage(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.split(";")[0]?.trim())
    .filter(Boolean) as string[];
}

export function resolveLocale(input?: ResolveLocaleInput): Locale {
  const direct = input?.locale ? normalizeLocale(input.locale) : undefined;
  const candidates: string[] = [];

  if (direct) candidates.push(direct);

  const acceptLanguage = input?.acceptLanguage
    ? parseAcceptLanguage(input.acceptLanguage)
    : [];

  candidates.push(...acceptLanguage.map(normalizeLocale));

  for (const candidate of candidates) {
    const exact = locales.find((l) => l === candidate);
    if (exact) return exact;

    const base = candidate.split("-")[0];
    const match = base ? locales.find((l) => l === base) : undefined;
    if (match) return match;
  }

  return defaultLocale;
}


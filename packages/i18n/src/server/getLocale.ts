import { cookies, headers } from "next/headers";

import type { Locale } from "../config";
import { resolveLocale } from "../utils";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  return resolveLocale({
    locale:
      cookieStore.get("NEXT_LOCALE")?.value ??
      cookieStore.get("locale")?.value,
    acceptLanguage: headerStore.get("accept-language"),
  });
}

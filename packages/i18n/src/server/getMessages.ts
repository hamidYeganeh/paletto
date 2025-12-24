import { cookies, headers } from "next/headers";

import { defaultLocale, type Locale } from "../config";
import { messagesByLocale } from "../messages";
import type { Messages } from "../types";
import { resolveLocale } from "../utils";

export async function getMessages(locale?: Locale): Promise<Messages> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const resolvedLocale =
    locale ??
    resolveLocale({
      locale:
        cookieStore.get("NEXT_LOCALE")?.value ?? cookieStore.get("locale")?.value,
      acceptLanguage: headerStore.get("accept-language"),
    });

  return messagesByLocale[resolvedLocale] ?? messagesByLocale[defaultLocale];
}

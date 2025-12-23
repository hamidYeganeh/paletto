import { createTranslator } from "next-intl";

import type { Locale } from "../config";
import { getLocale } from "./getLocale";
import { getMessages } from "./getMessages";

type TranslationOptions = {
  locale?: Locale;
};

export async function getTranslations(options: TranslationOptions = {}) {
  const locale = options.locale ?? (await getLocale());
  const messages = await getMessages(locale);

  return createTranslator({
    locale,
    messages,
  });
}

import { defaultLocale, type Locale } from "../config";
import { messagesByLocale } from "../messages";
import type { Messages } from "../types";
import { getLocale } from "./getLocale";

export async function getMessages(locale?: Locale): Promise<Messages> {
  const resolvedLocale = locale ?? (await getLocale());

  return messagesByLocale[resolvedLocale] ?? messagesByLocale[defaultLocale];
}

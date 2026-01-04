import type { ReactNode } from "react";
import { NextIntlClientProvider } from "@repo/i18n/client";
import { Locale, Messages } from "@repo/i18n";
import { ApiProvider } from "@repo/api";

export function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
}) {
  return (
    <NextIntlClientProvider
      timeZone="Asia/Tehran"
      locale={locale}
      messages={messages}
    >
      <ApiProvider>{children}</ApiProvider>
    </NextIntlClientProvider>
  );
}

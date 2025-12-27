import { FC, PropsWithChildren } from "react";
import { NextIntlClientProvider } from "@repo/i18n/client";
import { ApiProvider } from "@repo/api";
import { ThemeProvider } from "@repo/theme";
import { Locale, Messages } from "@repo/i18n";

interface ProvidersProps extends PropsWithChildren {
  locale: Locale;
  messages: Messages;
}

export const Providers: FC<ProvidersProps> = (props) => {
  const { children, locale, messages } = props;
  return (
    <NextIntlClientProvider
      timeZone="Asia/Tehran"
      locale={locale}
      messages={messages}
    >
      <ApiProvider>
        <ThemeProvider defaultMode="light">{children}</ThemeProvider>
      </ApiProvider>
    </NextIntlClientProvider>
  );
};

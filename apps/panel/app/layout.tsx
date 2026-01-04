import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Space_Grotesk } from "next/font/google";
import { cookies, headers } from "next/headers";
import { Locale, resolveLocale } from "@repo/i18n";
import { getMessages } from "@repo/i18n/server";
import { Providers } from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paletto Admin",
  description: "Admin dashboard for Paletto catalog management.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const locale: Locale = resolveLocale({
    locale:
      cookieStore.get("NEXT_LOCALE")?.value ?? cookieStore.get("locale")?.value,
    acceptLanguage: headerStore.get("accept-language"),
  });
  const messages = await getMessages(locale);
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen bg-panel font-sans text-panel-ink antialiased">
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

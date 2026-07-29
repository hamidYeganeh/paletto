import localFont from "next/font/local"
import { Space_Grotesk } from "next/font/google"
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages, getTranslations } from "next-intl/server"

import "@workspace/ui/globals.css"
import "./studio.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const iranSansX = localFont({
  src: "./fonts/IRANSansXV.woff2",
  variable: "--font-iransans-x",
  display: "swap",
  weight: "100 1000",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir="rtl"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        iranSansX.variable,
        spaceGrotesk.variable
      )}
    >
      <body className={iranSansX.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider forcedTheme="light" enableSystem={false}>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

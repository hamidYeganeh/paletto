import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Space_Grotesk } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen bg-panel font-sans text-panel-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

"use client"

import { useTranslations } from "next-intl"

function RevealLine({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <span className={`studio-reveal-line ${className ?? ""}`}>
      <span
        className="studio-reveal-inner"
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  )
}

export function Hero() {
  const t = useTranslations("Hero")

  return (
    <section
      id="top"
      className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-24 text-center"
    >
      <h1 className="studio-headline studio-hero-title max-w-[95vw] text-[clamp(3.5rem,12vw,9rem)]">
        <span className="block">
          <RevealLine delay={0}>{t("line1")}</RevealLine>
        </span>
        <span className="block">
          <RevealLine delay={120}>{t("line2")}</RevealLine>
        </span>
      </h1>
      <p className="studio-body mt-8 max-w-xl text-2xl text-[#525252]">
        <RevealLine delay={400}>{t("subtitle")}</RevealLine>
      </p>
    </section>
  )
}

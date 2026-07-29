"use client"

import { useTranslations } from "next-intl"

export function Intro() {
  const t = useTranslations("Intro")

  return (
    <section
      id="intro"
      data-journey-section="intro"
      className="relative z-[2] mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center md:py-32"
    >
      <p className="studio-mono mb-8 text-[#737373]">{t("eyebrow")}</p>
      <h2 className="studio-headline text-[clamp(2rem,5vw,3.75rem)] tracking-tighter">
        <span className="studio-reveal-line">
          <span className="studio-reveal-inner">{t("title")}</span>
        </span>
      </h2>
      <p className="studio-body mt-8 max-w-2xl text-lg text-[#525252] md:text-xl">
        {t("body")}
      </p>
    </section>
  )
}

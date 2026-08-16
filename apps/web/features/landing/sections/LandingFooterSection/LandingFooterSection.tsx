"use client"

import { useTranslations } from "next-intl"

export function LandingFooterSection() {
  const t = useTranslations("Footer")
  const year = new Intl.NumberFormat("fa-IR", { useGrouping: false }).format(
    new Date().getFullYear()
  )

  return (
    <footer id="contact" className="bg-[#0A0A0A] text-white">
      <div className="grid grid-cols-1 gap-12 px-6 py-20 md:grid-cols-4 md:gap-8 md:py-24">
        <div className="md:col-span-2">
          <h2 className="studio-headline text-[clamp(2.5rem,6vw,4.5rem)] tracking-tighter text-white">
            {t("brand")}
          </h2>
          <p className="studio-body mt-6 max-w-md text-base text-white/70 md:text-lg">
            {t("bio")}
          </p>
        </div>

        <div>
          <p className="studio-mono mb-6 text-white/50">{t("col4")}</p>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href="https://instagram.com"
                className="studio-body text-lg transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:opacity-50"
              >
                {t("instagram")}
              </a>
            </li>
            <li>
              <a
                href="https://t.me"
                className="studio-body text-lg transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:opacity-50"
              >
                {t("telegram")}
              </a>
            </li>
            <li>
              <a
                href="#newsletter"
                className="studio-body text-lg transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:opacity-50"
              >
                {t("newsletter")}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="studio-mono mb-6 text-white/50">{t("col5")}</p>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href={`mailto:${t("email")}`}
                className="studio-body text-lg transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:opacity-50"
              >
                {t("email")}
              </a>
            </li>
            <li>
              <a
                href="#press"
                className="studio-body text-lg transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:opacity-50"
              >
                {t("press")}
              </a>
            </li>
            <li>
              <span className="studio-body text-lg text-white/70">
                {t("visitHours")}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>{t("copyright", { year })}</p>
        <p>{t("credits")}</p>
      </div>
    </footer>
  )
}

"use client"

import { useTranslations } from "next-intl"

import { JOURNEY_SECTIONS } from "../../components/JourneyLine/journey-sections"

const persianNumber = new Intl.NumberFormat("fa-IR", {
  minimumIntegerDigits: 2,
  useGrouping: false,
})

/** Editorial journey chapter — sits in page flow; line draws across the whole track. */
export function LandingJourneySection() {
  const t = useTranslations("Journey")

  return (
    <section
      id="journey"
      className="studio-journey relative z-[2] px-6 py-24 md:py-32"
      aria-label={t("ariaLabel")}
    >
      <div className="mb-12 flex items-end justify-between gap-4 border-t border-black/10 pt-8 md:mb-16">
        <div>
          <p className="studio-mono mb-4 text-[#737373]">{t("eyebrow")}</p>
          <h2 className="studio-headline max-w-xl text-[clamp(2rem,4vw,3rem)] tracking-tighter">
            {t("title")}
          </h2>
        </div>
      </div>

      <ol className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
        {JOURNEY_SECTIONS.map((section, index) => (
          <li
            key={section.id}
            data-journey-stop={index}
            className={`studio-journey-stop ${index % 2 === 1 ? "md:mt-16" : ""}`}
          >
            <p className="studio-mono mb-2 text-[#737373]">
              {persianNumber.format(index + 1)}
            </p>
            <h3 className="studio-headline text-2xl tracking-tighter md:text-3xl">
              {t(`stops.${section.stop}.title`)}
            </h3>
            <p className="studio-body mt-3 max-w-sm text-[#525252]">
              {t(`stops.${section.stop}.body`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

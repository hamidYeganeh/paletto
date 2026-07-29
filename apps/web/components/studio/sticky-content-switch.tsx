"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { PLACEHOLDER_IMAGE } from "./projects"

gsap.registerPlugin(ScrollTrigger)

const CHAPTERS = [
  {
    id: "renaissance",
    image: PLACEHOLDER_IMAGE,
    alt: "Renaissance painting",
  },
  {
    id: "impressionism",
    image: PLACEHOLDER_IMAGE,
    alt: "Impressionist painting",
  },
  {
    id: "symbolism",
    image: PLACEHOLDER_IMAGE,
    alt: "Symbolist portrait",
  },
  {
    id: "modern",
    image: PLACEHOLDER_IMAGE,
    alt: "Modern artwork",
  },
] as const

export function StickyContentSwitch() {
  const t = useTranslations("Focus")
  const sectionRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-sticky-panel]", section)

      panels.forEach((panel, index) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top center",
          end: "bottom center",
          onEnter: () => switchTo(index),
          onEnterBack: () => switchTo(index),
        })
      })

      function switchTo(index: number) {
        if (activeRef.current === index) return
        activeRef.current = index

        const copy = copyRef.current
        if (!copy || reduced) {
          setActive(index)
          return
        }

        gsap.to(copy, {
          yPercent: -30,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () => {
            setActive(index)
            gsap.fromTo(
              copy,
              { yPercent: 40, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.55,
                ease: "power3.out",
              }
            )
          },
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  const chapterId = CHAPTERS[active]?.id ?? "renaissance"

  return (
    <section
      ref={sectionRef}
      id="collections"
      data-journey-section="focus"
      className="studio-sticky-switch relative z-[2] px-6 py-24 md:py-32"
      aria-label={t("ariaLabel")}
    >
      <div className="mb-12 flex items-end justify-between gap-4 border-t border-black/10 pt-8 md:mb-16">
        <p className="studio-mono text-[#737373]">{t("eyebrow")}</p>
      </div>

      <div className="studio-sticky-layout grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* Left: sticky heading */}
        <div className="md:sticky md:top-[30vh] md:self-start">
          <div ref={copyRef} className="max-w-md">
            <p className="studio-mono mb-4 text-[#737373]">
              {t(`chapters.${chapterId}.category`)}
              <span className="mx-3 text-black/20">/</span>
              {t(`chapters.${chapterId}.badge`)}
            </p>
            <h2 className="studio-headline text-[clamp(2.5rem,6vw,4.5rem)] tracking-tighter">
              {t(`chapters.${chapterId}.title`)}
            </h2>
            <p className="studio-body mt-6 text-lg text-[#525252] md:text-xl">
              {t(`chapters.${chapterId}.description`)}
            </p>

            <ol className="mt-10 flex flex-col gap-2" aria-hidden="true">
              {CHAPTERS.map((chapter, index) => (
                <li
                  key={chapter.id}
                  className={`studio-mono transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
                    index === active ? "opacity-100" : "opacity-30"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")} —{" "}
                  {t(`chapters.${chapter.id}.title`)}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right: scrolling images */}
        <div className="flex flex-col gap-8 md:gap-16">
          {CHAPTERS.map((chapter, index) => (
            <article
              key={chapter.id}
              data-sticky-panel
              data-index={index}
              className="group"
            >
              <div className="studio-img-wrap relative aspect-[4/5] overflow-hidden rounded-sm bg-neutral-100 md:aspect-[3/4]">
                <Image
                  src={chapter.image}
                  alt={chapter.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="studio-img object-cover"
                />
              </div>
              <p className="studio-mono mt-4 text-[#737373] md:hidden">
                {t(`chapters.${chapter.id}.title`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

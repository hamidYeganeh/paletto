"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { PLACEHOLDER_IMAGE } from "../../components/projects"

gsap.registerPlugin(ScrollTrigger)

type TiltItem = {
  id: string
  image: string
  alt: string
  aspect: string
}

const COLUMN_SPEEDS = [1.2, 1.0, 1.4] as const

const TILT_ITEMS: TiltItem[] = [
  {
    id: "tilt-1",
    image: PLACEHOLDER_IMAGE,
    alt: "Classical portrait",
    aspect: "aspect-[3/4]",
  },
  {
    id: "tilt-2",
    image: PLACEHOLDER_IMAGE,
    alt: "Abstract expression",
    aspect: "aspect-[4/5]",
  },
  {
    id: "tilt-3",
    image: PLACEHOLDER_IMAGE,
    alt: "Gallery portrait",
    aspect: "aspect-[3/4]",
  },
  {
    id: "tilt-4",
    image: PLACEHOLDER_IMAGE,
    alt: "Ornate detail",
    aspect: "aspect-[4/5]",
  },
  {
    id: "tilt-5",
    image: PLACEHOLDER_IMAGE,
    alt: "Wave artwork",
    aspect: "aspect-[3/4]",
  },
  {
    id: "tilt-6",
    image: PLACEHOLDER_IMAGE,
    alt: "Renaissance scene",
    aspect: "aspect-[4/5]",
  },
  {
    id: "tilt-7",
    image: PLACEHOLDER_IMAGE,
    alt: "Sculpture study",
    aspect: "aspect-[3/4]",
  },
  {
    id: "tilt-8",
    image: PLACEHOLDER_IMAGE,
    alt: "Ink wash",
    aspect: "aspect-[4/5]",
  },
  {
    id: "tilt-9",
    image: PLACEHOLDER_IMAGE,
    alt: "Studio still life",
    aspect: "aspect-[3/4]",
  },
]

function splitColumns(items: TiltItem[]): [TiltItem[], TiltItem[], TiltItem[]] {
  const columns: [TiltItem[], TiltItem[], TiltItem[]] = [[], [], []]
  items.forEach((item, i) => {
    const col = (i % 3) as 0 | 1 | 2
    columns[col].push(item)
  })
  return columns
}

export function LandingParallaxSection() {
  const t = useTranslations("Parallax")
  const sectionRef = useRef<HTMLElement>(null)
  const columns = splitColumns(TILT_ITEMS)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const mm = gsap.matchMedia()

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const colEls = gsap.utils.toArray<HTMLElement>("[data-parallax-col]", section)

        colEls.forEach((col) => {
          const speed = Number(col.dataset.speed ?? 1)
          const travel = (speed - 1) * -180

          gsap.to(col, {
            y: travel,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          })
        })

        const cards = gsap.utils.toArray<HTMLElement>("[data-tilt-card]", section)

        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { rotateX: 14, transformPerspective: 900 },
            {
              rotateX: -14,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          )
        })
      }, section)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="parallax"
      className="studio-parallax relative z-[2] px-6 py-24 md:py-32"
      aria-label={t("ariaLabel")}
    >
      <div className="mb-12 flex items-end justify-between gap-4 border-t border-black/10 pt-8 md:mb-16">
        <h2 className="studio-headline max-w-2xl text-[clamp(2rem,4vw,3rem)] tracking-tighter">
          {t("title")}
        </h2>
        <p className="studio-mono shrink-0 text-[#737373]">{t("eyebrow")}</p>
      </div>

      <div className="studio-parallax-grid grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {columns.map((column, colIndex) => (
          <div
            key={`col-${colIndex}`}
            data-parallax-col
            data-speed={COLUMN_SPEEDS[colIndex]}
            className={`studio-parallax-col flex flex-col gap-6 md:gap-8 ${
              colIndex === 0
                ? "md:mt-12"
                : colIndex === 2
                  ? "md:mt-24"
                  : "md:mt-0"
            }`}
          >
            {column.map((item) => (
              <article key={item.id} className="group">
                <div
                  data-tilt-card
                  className={`studio-img-wrap studio-tilt-card relative overflow-hidden rounded-sm bg-neutral-100 ${item.aspect}`}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="studio-img object-cover"
                  />
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

const HAND = "/images/hero-hand.png"

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
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const content = contentRef.current
    if (!content) return

    function onScroll() {
      const scrolled = window.scrollY
      if (scrolled >= 1000) return
      content!.style.transform = `translateY(${scrolled * 0.4}px)`
      content!.style.opacity = String(Math.max(0, 1 - scrolled / 600))
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section
      id="top"
      className="studio-hero relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20 text-center"
    >
      <div className="studio-hero-fade pointer-events-none absolute inset-0 z-0" />

      <div className="studio-hero-float-left pointer-events-none absolute top-[-10%] left-[-10%] z-10 w-[50vw] max-w-200 opacity-90 mix-blend-screen grayscale md:top-[-15%] md:left-[-5%] md:w-[40vw]">
        <Image
          src={HAND}
          alt={t("handLeftAlt")}
          width={1024}
          height={877}
          priority
          className="h-auto w-full object-contain"
        />
      </div>

      <div className="studio-hero-float-right pointer-events-none absolute right-[-10%] bottom-[-10%] z-10 w-[45vw] max-w-175 opacity-90 mix-blend-screen grayscale md:right-[-5%] md:bottom-[-5%] md:w-[35vw]">
        <Image
          src={HAND}
          alt={t("handRightAlt")}
          width={1024}
          height={877}
          priority
          className="h-auto w-full -scale-x-100 object-contain"
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-20 w-full max-w-[95vw] px-8 py-16 will-change-transform sm:px-12 md:px-20 md:py-24"
      >
        <h1 className="studio-headline studio-hero-title text-[clamp(3.5rem,12vw,9rem)] text-white">
          <span className="block">
            <RevealLine delay={0}>{t("line1")}</RevealLine>
          </span>
          <span className="block">
            <RevealLine delay={120}>{t("line2")}</RevealLine>
          </span>
        </h1>
      </div>
    </section>
  )
}

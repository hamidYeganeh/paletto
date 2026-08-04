"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { studioProjects } from "../../components/projects"

gsap.registerPlugin(ScrollTrigger)

const INIT_DELAY_MS = 120
const WIDTH_RETRY_MS = 60
const MAX_WIDTH_RETRIES = 20

export function LandingHorizontalGallerySection() {
  const t = useTranslations("Horizontal")
  const tArt = useTranslations("Artworks")
  const tWorks = useTranslations("Works.items")

  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const track = trackRef.current
    if (!section || !pin || !track) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setReady(true)
      return
    }

    let ctx: gsap.Context | undefined
    let cancelled = false
    let delayId = 0
    let retryId = 0
    let rafId = 0
    let retries = 0

    const getScrollDistance = () => {
      // Force layout read after paint
      void track.offsetWidth
      return Math.max(0, track.scrollWidth - pin.clientWidth)
    }

    const setup = () => {
      if (cancelled) return

      const distance = getScrollDistance()

      // Safety: wait until track is wider than the viewport pin
      if (distance < 8) {
        retries += 1
        if (retries < MAX_WIDTH_RETRIES) {
          retryId = window.setTimeout(setup, WIDTH_RETRY_MS)
        } else {
          setReady(true)
        }
        return
      }

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: pin,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.textContent = `${Math.round(self.progress * 100)}٪`
              }
            },
          },
        })
      }, section)

      // One more refresh after images/fonts settle
      rafId = requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        setReady(true)
      })
    }

    const start = () => {
      if (cancelled) return
      rafId = requestAnimationFrame(setup)
    }

    // Delay so React commit + first paint complete before measuring
    delayId = window.setTimeout(start, INIT_DELAY_MS)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener("resize", onResize)

    // When images load, widths change — refresh once
    const images = track.querySelectorAll("img")
    const onImgLoad = () => ScrollTrigger.refresh()
    images.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onImgLoad, { once: true })
    })

    return () => {
      cancelled = true
      window.clearTimeout(delayId)
      window.clearTimeout(retryId)
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onResize)
      images.forEach((img) => img.removeEventListener("load", onImgLoad))
      ctx?.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="horizontal"
      className="studio-horizontal relative z-[2]"
      aria-label={t("ariaLabel")}
      data-ready={ready ? "true" : "false"}
    >
      <div
        ref={pinRef}
        className="studio-horizontal-pin flex h-svh flex-col overflow-hidden"
      >
        <div className="flex shrink-0 items-end justify-between gap-4 border-b border-black/10 px-6 py-6 md:px-8">
          <div>
            <p className="studio-mono mb-2 text-[#737373]">{t("eyebrow")}</p>
            <h2 className="studio-headline text-[clamp(1.75rem,3.5vw,2.75rem)] tracking-tighter">
              {t("title")}
            </h2>
          </div>
          <p className="studio-mono text-[#737373]">
            <span ref={progressRef}>0٪</span>
          </p>
        </div>

        <div className="relative min-h-0 flex-1">
          <div
            ref={trackRef}
            className="studio-horizontal-track absolute inset-y-0 start-0 flex h-full items-center gap-6 px-6 md:gap-10 md:px-8"
          >
            {studioProjects.map((project, index) => (
              <article
                key={project.id}
                className="group relative flex h-[min(68vh,640px)] w-[min(78vw,420px)] shrink-0 flex-col md:w-[min(55vw,520px)]"
              >
                <div className="studio-img-wrap relative min-h-0 flex-1 overflow-hidden rounded-sm bg-neutral-100">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 768px) 78vw, 520px"
                    className="studio-img object-cover"
                    priority={index < 2}
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4 border-t border-black/10 pt-4">
                  <div>
                    <p className="studio-mono mb-1 text-[#737373]">
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(studioProjects.length).padStart(2, "0")}
                    </p>
                    <h3 className="studio-headline text-xl tracking-tighter md:text-2xl">
                      {tArt(project.titleKey)}
                    </h3>
                    <p className="studio-mono mt-2 text-[#737373]">
                      {tWorks(`${project.id}.category`)}
                    </p>
                  </div>
                  <span className="studio-mono shrink-0 text-[#737373]">
                    {project.year}
                  </span>
                </div>
              </article>
            ))}

            <div
              className="flex h-[min(68vh,640px)] w-[min(70vw,360px)] shrink-0 flex-col justify-end border-s border-black/10 ps-8"
              aria-hidden="true"
            >
              <p className="studio-mono text-[#737373]">{t("endLabel")}</p>
              <p className="studio-headline mt-3 text-3xl tracking-tighter md:text-4xl">
                {t("endTitle")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

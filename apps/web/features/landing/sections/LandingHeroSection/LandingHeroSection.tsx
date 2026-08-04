"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"

import { galleryArtworks } from "@/features/gallery"
import {
  createTunnelScene,
  type TunnelSceneHandle,
} from "../../components/TunnelScene"

/** Cap how many remote images we bind into the tunnel (pool size). */
const TUNNEL_IMAGES = galleryArtworks.slice(0, 12).map((a) => a.src)

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

export function LandingHeroSection() {
  const t = useTranslations("Hero")
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<TunnelSceneHandle | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const content = contentRef.current
    if (!section || !canvas) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    let cancelled = false
    let raf = 0
    let handle: TunnelSceneHandle | null = null
    let inView = true
    let pageVisible = document.visibilityState === "visible"
    let looping = false

    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      looping = false
    }

    const tick = () => {
      if (!handle || cancelled) {
        looping = false
        return
      }

      if (!inView || !pageVisible) {
        looping = false
        raf = 0
        return
      }

      const needsAnother = handle.render()
      if (needsAnother) {
        raf = requestAnimationFrame(tick)
      } else {
        looping = false
        raf = 0
      }
    }

    const startLoop = () => {
      if (cancelled || looping || !handle) return
      if (!inView || !pageVisible) return
      looping = true
      raf = requestAnimationFrame(tick)
    }

    try {
      handle = createTunnelScene(canvas, {
        imageUrls: TUNNEL_IMAGES,
        onDirty: () => {
          if (!cancelled) startLoop()
        },
      })
    } catch {
      return
    }

    if (cancelled) {
      handle.dispose()
      return
    }

    handleRef.current = handle
    handle.resize(window.innerWidth, window.innerHeight)

    const syncFromScroll = () => {
      if (!handle) return
      const rect = section.getBoundingClientRect()
      const scrolled = Math.max(0, -rect.top)
      handle.setScrollDepth(scrolled)

      inView = rect.bottom > 0 && rect.top < window.innerHeight

      if (content) {
        const fade = Math.max(0, 1 - scrolled / (window.innerHeight * 1.2))
        content.style.opacity = String(fade)
        content.style.transform = `translateY(${scrolled * 0.15}px)`
      }

      if (inView && pageVisible) startLoop()
      else stopLoop()
    }

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (!handle) return
        handle.resize(window.innerWidth, window.innerHeight)
        startLoop()
      }, 100)
    }

    const onVisibility = () => {
      pageVisible = document.visibilityState === "visible"
      if (pageVisible && inView) startLoop()
      else stopLoop()
    }

    // Pause when the sticky viewport leaves the screen
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry?.isIntersecting ?? false
              if (inView && pageVisible) startLoop()
              else stopLoop()
            },
            { threshold: 0 }
          )
        : null
    io?.observe(section)

    syncFromScroll()
    startLoop()

    window.addEventListener("scroll", syncFromScroll, { passive: true })
    window.addEventListener("resize", onResize, { passive: true })
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelled = true
      window.removeEventListener("scroll", syncFromScroll)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVisibility)
      window.clearTimeout(resizeTimer)
      io?.disconnect()
      stopLoop()
      handle?.dispose()
      handleRef.current = null
    }
  }, [])

  return (
    <section
      id="top"
      ref={sectionRef}
      className="studio-hero studio-hero-tunnel relative"
      aria-label={t("line1")}
    >
      <div className="studio-hero-sticky sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          aria-hidden
        />

        <div className="studio-hero-fade pointer-events-none absolute inset-0 z-10" />

        <div
          ref={contentRef}
          className="relative z-20 w-full max-w-[95vw] px-8 py-16 text-center will-change-transform sm:px-12 md:px-20 md:py-24"
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
      </div>
    </section>
  )
}

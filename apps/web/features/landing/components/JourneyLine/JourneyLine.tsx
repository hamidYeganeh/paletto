"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { JOURNEY_SECTIONS } from "./journey-sections"

gsap.registerPlugin(ScrollTrigger)

/** Narrow serpentine down the page center — reads as a connector, not a full-bleed scribble. */
function buildPathD(w: number, h: number) {
  const mid = w * 0.5
  const amp = Math.min(72, w * 0.1)
  const x1 = mid - amp
  const x2 = mid + amp
  const s = h / 6

  return [
    `M ${mid} 0`,
    `C ${mid} ${s * 0.35}, ${x2} ${s * 0.55}, ${x2} ${s}`,
    `C ${x2} ${s * 1.4}, ${x1} ${s * 1.55}, ${x1} ${s * 2}`,
    `C ${x1} ${s * 2.4}, ${x2} ${s * 2.55}, ${x2} ${s * 3}`,
    `C ${x2} ${s * 3.4}, ${x1} ${s * 3.55}, ${x1} ${s * 4}`,
    `C ${x1} ${s * 4.4}, ${x2} ${s * 4.55}, ${x2} ${s * 5}`,
    `C ${x2} ${s * 5.4}, ${mid} ${s * 5.55}, ${mid} ${h}`,
  ].join(" ")
}

function pointAtProgress(path: SVGPathElement, progress: number) {
  const length = path.getTotalLength()
  return path.getPointAtLength(Math.max(0, Math.min(1, progress)) * length)
}

export function JourneyLine() {
  const t = useTranslations("Journey")
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const guideRef = useRef<SVGPathElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const path = pathRef.current
    const guide = guideRef.current
    const svg = svgRef.current
    if (!root || !path || !guide || !svg) return

    const track = root.closest<HTMLElement>(".studio-journey-track")
    if (!track) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const nodes = () =>
      root.querySelectorAll<SVGGElement>("[data-journey-node]")
    const chapterStops = () =>
      track.querySelectorAll<HTMLElement>("[data-journey-stop]")

    let thresholds: number[] = JOURNEY_SECTIONS.map((_, i) => (i + 0.5) / JOURNEY_SECTIONS.length)
    let length = 0

    const layout = () => {
      const w = Math.max(track.clientWidth, 320)
      const h = Math.max(track.scrollHeight, window.innerHeight)
      const d = buildPathD(w, h)

      svg.setAttribute("viewBox", `0 0 ${w} ${h}`)
      svg.setAttribute("width", String(w))
      svg.setAttribute("height", String(h))
      guide.setAttribute("d", d)
      path.setAttribute("d", d)

      const trackTop = track.getBoundingClientRect().top + window.scrollY

      thresholds = JOURNEY_SECTIONS.map((section, i) => {
        const el = track.querySelector<HTMLElement>(
          `[data-journey-section="${section.id}"]`
        )
        if (!el) return (i + 0.5) / JOURNEY_SECTIONS.length
        const top = el.getBoundingClientRect().top + window.scrollY - trackTop
        return Math.max(0.04, Math.min(0.96, top / h))
      })

      nodes().forEach((node, i) => {
        const p = thresholds[i] ?? 0.5
        const pt = pointAtProgress(guide, p)
        node.setAttribute("transform", `translate(${pt.x} ${pt.y})`)
        node.dataset.progress = String(p)
      })

      length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
      return length
    }

    layout()

    if (reduced) {
      path.style.strokeDashoffset = "0"
      nodes().forEach((el) => el.classList.add("is-active"))
      chapterStops().forEach((el) => el.classList.add("is-active"))
      return
    }

    const syncMarkers = (p: number) => {
      nodes().forEach((el, i) => {
        const threshold = Number(el.dataset.progress ?? thresholds[i] ?? 1)
        el.classList.toggle("is-active", p >= threshold - 0.02)
      })
      chapterStops().forEach((el) => {
        const index = Number(el.dataset.journeyStop)
        const threshold = thresholds[index] ?? 1
        el.classList.toggle("is-active", p >= threshold - 0.02)
      })
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        path,
        { strokeDashoffset: () => length },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            id: "studio-journey-draw",
            trigger: track,
            // Hero sits above the track; footer sits below — draw spans the journey.
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onRefresh: () => {
              layout()
            },
            onUpdate: (self) => syncMarkers(self.progress),
          },
        }
      )
    }, root)

    // Pinning (horizontal gallery) and late image layout change track height.
    const refreshSoon = window.setTimeout(() => ScrollTrigger.refresh(), 600)
    const observer = new MutationObserver(() => ScrollTrigger.refresh())
    const horizontal = track.querySelector(".studio-horizontal")
    if (horizontal) {
      observer.observe(horizontal, {
        attributes: true,
        attributeFilter: ["data-ready"],
      })
    }

    return () => {
      window.clearTimeout(refreshSoon)
      observer.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="studio-journey-line pointer-events-none absolute inset-x-0 top-0 z-[1] h-full w-full"
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="studio-journey-svg absolute inset-0 h-full w-full overflow-visible"
        fill="none"
      >
        <path
          ref={guideRef}
          stroke="rgb(0 0 0 / 0.08)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          ref={pathRef}
          stroke="#000"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {JOURNEY_SECTIONS.map((section) => (
          <g
            key={section.id}
            data-journey-node={section.id}
            className="studio-journey-node"
          >
            <circle
              cx="0"
              cy="0"
              r="7"
              className="studio-journey-node__ring"
              fill="#fff"
              stroke="#000"
              strokeWidth="1"
            />
            <circle
              cx="0"
              cy="0"
              r="2.5"
              className="studio-journey-node__dot"
              fill="#000"
            />
            <title>{t(`stops.${section.stop}.title`)}</title>
          </g>
        ))}
      </svg>
    </div>
  )
}

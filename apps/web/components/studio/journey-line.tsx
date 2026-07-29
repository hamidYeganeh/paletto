"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = [
  { id: "marquee", stop: "arrive" },
  { id: "intro", stop: "look" },
  { id: "focus", stop: "pause" },
  { id: "works", stop: "leave" },
] as const

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
  const progressRef = useRef<HTMLSpanElement>(null)
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

    let thresholds: number[] = SECTIONS.map((_, i) => (i + 0.5) / SECTIONS.length)
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

      thresholds = SECTIONS.map((section, i) => {
        const el = track.querySelector<HTMLElement>(
          `[data-journey-section="${section.id}"]`
        )
        if (!el) return (i + 0.5) / SECTIONS.length
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
      if (progressRef.current) progressRef.current.textContent = "۱۰۰٪"
      return
    }

    const syncMarkers = (p: number) => {
      if (progressRef.current) {
        progressRef.current.textContent = `${Math.round(p * 100)}٪`
      }
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
      <div className="studio-journey-progress pointer-events-none fixed top-1/2 end-5 z-[2] hidden -translate-y-1/2 md:block lg:end-8">
        <p className="studio-mono text-sm text-[#737373]">
          <span className="sr-only">{t("ariaLabel")}</span>
          <span ref={progressRef}>0٪</span>
        </p>
      </div>

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
        {SECTIONS.map((section) => (
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

/** Editorial journey chapter — sits in page flow; line draws across the whole track. */
export function JourneyChapter() {
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
        {SECTIONS.map((section, index) => (
          <li
            key={section.id}
            data-journey-stop={index}
            className={`studio-journey-stop ${index % 2 === 1 ? "md:mt-16" : ""}`}
          >
            <p className="studio-mono mb-2 text-[#737373]">
              {String(index + 1).padStart(2, "0")}
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

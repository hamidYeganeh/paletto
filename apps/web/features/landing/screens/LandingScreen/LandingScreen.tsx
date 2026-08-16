"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { CustomCursor } from "../../components/CustomCursor"
import { JourneyLine } from "../../components/JourneyLine"
import { LandingFooterSection } from "../../sections/LandingFooterSection"
import { LandingHorizontalGallerySection } from "../../sections/LandingHorizontalGallerySection"
import { LandingIntroSection } from "../../sections/LandingIntroSection"
import { LandingJourneySection } from "../../sections/LandingJourneySection"
import { LandingMarqueeSection } from "../../sections/LandingMarqueeSection"
import { LandingParallaxSection } from "../../sections/LandingParallaxSection"
import { LandingProjectGridSection } from "../../sections/LandingProjectGridSection"
import { LandingStickySwitchSection } from "../../sections/LandingStickySwitchSection"

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

type Artwork = {
  id: string
  title: string
  titleLines: string[]
  artist: string
  movement: string
  year: string
  height: string
  width: string
  image: string
  position: string
  description: string
}

const artworks: Artwork[] = [
  {
    id: "school-of-athens",
    title: "مکتب آتن",
    titleLines: ["مکتب", "آتن"],
    artist: "رافائل",
    movement: "رنسانس عالی ایتالیا",
    year: "1511",
    height: "500",
    width: "770",
    image: "/images/museum-school-of-athens.jpg",
    position: "center 46%",
    description:
      "رافائل اندیشمندان بزرگ جهان باستان را در تالاری آرمانی گرد هم آورده است؛ افلاطون و ارسطو در مرکز این روایت ایستاده‌اند.",
  },
  {
    id: "death-of-socrates",
    title: "مرگ سقراط",
    titleLines: ["مرگ", "سقراط"],
    artist: "ژاک-لویی داوید",
    movement: "نئوکلاسیسیسم فرانسه",
    year: "1787",
    height: "130",
    width: "196",
    image: "/images/museum-death-of-socrates.jpg",
    position: "center center",
    description:
      "سقراط که به نوشیدن شوکران محکوم شده، آرام دستش را به سوی جام دراز می‌کند و در آخرین لحظه نیز به شاگردانش می‌آموزد.",
  },
  {
    id: "azure-interruption",
    title: "گسست لاجوردی",
    titleLines: ["گسست", "لاجوردی"],
    artist: "استودیوی پالتو",
    movement: "بیان انتزاعی",
    year: "2024",
    height: "180",
    width: "180",
    image: "/images/museum-azure-interruption.png",
    position: "center center",
    description:
      "میدانی لاجوردی با حرکتی نارنجی شکافته می‌شود؛ تعادلی میان سکون تصویر و ضربه‌ای ناگهانی از حرکت.",
  },
  {
    id: "quiet-garden",
    title: "باغ خاموش",
    titleLines: ["باغ", "خاموش"],
    artist: "مجموعه پالتو",
    movement: "فیگوراتیو معاصر",
    year: "2025",
    height: "161",
    width: "160",
    image: "/images/museum-quiet-garden.png",
    position: "center center",
    description:
      "پیکری تنها در کنار باغی سرشار از گل، روایتی آرام و صمیمی از رنگ، سکوت و خاطره می‌سازد.",
  },
  {
    id: "architectures-of-memory",
    title: "معماری خاطره",
    titleLines: ["معماری", "خاطره"],
    artist: "استودیوی پالتو",
    movement: "هندسه مدرن",
    year: "2026",
    height: "180",
    width: "180",
    image: "/images/museum-architectures-memory.png",
    position: "center center",
    description:
      "قوس‌های لایه‌لایه و فرم‌های مدور، فضایی خیالی را به یادمانی دقیق و رؤیاگونه از مکان‌های به‌یادمانده تبدیل می‌کنند.",
  },
]

const chapterProgress = [0, 0.14, 0.28, 0.42, 0.6, 0.92]

const persianNumber = new Intl.NumberFormat("fa-IR", { useGrouping: false })

function getStoryStep(progress: number) {
  let step = 0

  for (let index = 1; index < chapterProgress.length; index += 1) {
    const previous = chapterProgress[index - 1] ?? 0
    const current = chapterProgress[index] ?? 1

    if (progress >= (previous + current) / 2) step = index
  }

  return step
}

export function LandingScreen() {
  const rootRef = useRef<HTMLElement>(null)
  const scrollRangeRef = useRef<{ start: number; end: number } | null>(null)
  const storyStepRef = useRef(0)
  const [storyStep, setStoryStep] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const scrollToChapter = useCallback((chapter: number) => {
    const progress = chapterProgress[chapter] ?? 0
    const scrollRange = scrollRangeRef.current
    const start = scrollRange?.start ?? rootRef.current?.offsetTop ?? 0
    const distance = scrollRange
      ? scrollRange.end - scrollRange.start
      : window.innerHeight * 9

    window.scrollTo({
      top: start + distance * progress,
      behavior: "auto",
    })
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      const root = rootRef.current
      const scenes = gsap.utils.toArray<HTMLElement>(".museum-scene")
      const room = root?.querySelector<HTMLElement>(".museum-room")

      if (!root || !room || scenes.length !== artworks.length) return

      const firstScene = scenes[0]
      const finalScene = scenes.at(-1)

      if (!firstScene || !finalScene) return

      gsap.set(scenes, { autoAlpha: 0, pointerEvents: "none" })
      gsap.set(firstScene, { autoAlpha: 1, pointerEvents: "auto" })
      gsap.set(room, { autoAlpha: 0, pointerEvents: "none" })

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return
      }

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 9, 6500)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            scrollRangeRef.current = { start: self.start, end: self.end }
          },
          onUpdate: (self) => {
            const nextStep = getStoryStep(self.progress)

            if (storyStepRef.current !== nextStep) {
              storyStepRef.current = nextStep
              setStoryStep(nextStep)
            }
          },
        },
      })

      timeline.addLabel("artwork-0", 0)

      scenes.slice(0, -1).forEach((outgoingScene, index) => {
        const incomingScene = scenes[index + 1]

        if (!incomingScene) return

        const outgoingArtwork = outgoingScene.querySelector(".museum-artwork")
        const outgoingCopy = outgoingScene.querySelector(".museum-hero-copy")
        const outgoingFooter = outgoingScene.querySelectorAll(
          ".museum-project-mark, .museum-facts > div, .museum-admission"
        )
        const incomingArtwork = incomingScene.querySelector(".museum-artwork")
        const incomingCopy = incomingScene.querySelector(".museum-hero-copy")
        const incomingFooter = incomingScene.querySelectorAll(
          ".museum-project-mark, .museum-facts > div, .museum-admission"
        )
        const start = index * 1.18

        timeline
          .to(
            outgoingArtwork,
            {
              xPercent: -11,
              scale: 1.12,
              filter: "blur(18px)",
              duration: 1.02,
            },
            start
          )
          .to(
            outgoingCopy,
            {
              xPercent: -18,
              autoAlpha: 0,
              filter: "blur(8px)",
              duration: 0.52,
            },
            start + 0.08
          )
          .to(
            outgoingFooter,
            {
              y: 26,
              autoAlpha: 0,
              stagger: 0.035,
              duration: 0.38,
            },
            start + 0.1
          )
          .to(outgoingScene, { autoAlpha: 0, duration: 0.5 }, start + 0.36)
          .fromTo(
            incomingScene,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.68 },
            start + 0.27
          )
          .fromTo(
            incomingArtwork,
            { xPercent: 13, scale: 1.13, filter: "blur(22px)" },
            {
              xPercent: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.05,
            },
            start + 0.21
          )
          .fromTo(
            incomingCopy,
            { xPercent: 17, autoAlpha: 0, filter: "blur(8px)" },
            {
              xPercent: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.66,
            },
            start + 0.49
          )
          .fromTo(
            incomingFooter,
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.04,
              duration: 0.42,
            },
            start + 0.61
          )
          .set(outgoingScene, { pointerEvents: "none" }, start + 0.84)
          .set(incomingScene, { pointerEvents: "auto" }, start + 0.84)
          .addLabel(`artwork-${index + 1}`, start + 1.16)
      })

      const finalArtwork = finalScene.querySelector(".museum-artwork")
      const finalShade = finalScene.querySelector(".museum-shade")
      const finalCopy = finalScene.querySelector(".museum-hero-copy")
      const finalFooter = finalScene.querySelectorAll(
        ".museum-project-mark, .museum-facts > div, .museum-admission"
      )
      const roomFrame = room.querySelector(".museum-room-feature")
      const roomSurroundings = room.querySelectorAll(
        ".museum-room-light, .museum-room-side-frame, .museum-room-floor"
      )
      const visitors = room.querySelectorAll(".museum-visitor")
      const roomFooter = room.querySelector(".museum-room-footer")
      const roomStart = scenes.length * 1.18

      timeline
        .to(finalArtwork, { scale: 1.035, duration: 0.5 }, roomStart)
        .to(
          finalCopy,
          {
            xPercent: 15,
            autoAlpha: 0,
            filter: "blur(7px)",
            duration: 0.44,
          },
          roomStart + 0.58
        )
        .to(
          finalFooter,
          {
            y: 22,
            autoAlpha: 0,
            stagger: 0.025,
            duration: 0.32,
          },
          roomStart + 0.59
        )
        .to(finalShade, { opacity: 0.18, duration: 0.42 }, roomStart + 0.55)
        .to(
          finalArtwork,
          {
            scale: 0.68,
            autoAlpha: 0,
            filter: "blur(14px)",
            duration: 1.08,
          },
          roomStart + 0.52
        )
        .fromTo(
          room,
          { autoAlpha: 0, scale: 1.08 },
          { autoAlpha: 1, scale: 1, duration: 1.08 },
          roomStart + 0.54
        )
        .fromTo(
          roomFrame,
          { scale: 2.55, yPercent: 9, filter: "blur(11px)" },
          {
            scale: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1.16,
          },
          roomStart + 0.49
        )
        .fromTo(
          roomSurroundings,
          { autoAlpha: 0, scale: 1.08 },
          {
            autoAlpha: 1,
            scale: 1,
            stagger: 0.045,
            duration: 0.58,
          },
          roomStart + 0.94
        )
        .fromTo(
          visitors,
          { autoAlpha: 0, y: 72 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.62,
          },
          roomStart + 1.07
        )
        .fromTo(
          roomFooter,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.42 },
          roomStart + 1.18
        )
        .set(finalScene, { pointerEvents: "none" }, roomStart + 1.18)
        .set(room, { pointerEvents: "auto" }, roomStart + 1.18)
        .addLabel("gallery-room", roomStart + 1.65)
        .to({}, { duration: 1.1 })

      ScrollTrigger.refresh()
    }, rootRef.current)

    return () => {
      scrollRangeRef.current = null
      context.revert()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        setDetailsOpen(false)
      }

      if (!menuOpen && !detailsOpen) {
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          if (storyStepRef.current < chapterProgress.length - 1) {
            event.preventDefault()
            scrollToChapter(storyStepRef.current + 1)
          }
        }
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          if (storyStepRef.current > 0) {
            event.preventDefault()
            scrollToChapter(storyStepRef.current - 1)
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [detailsOpen, menuOpen, scrollToChapter])

  useEffect(() => {
    if (!menuOpen && !detailsOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [detailsOpen, menuOpen])

  const activeArtworkIndex = Math.min(storyStep, artworks.length - 1)
  const activeArtwork = artworks[activeArtworkIndex]!
  const storyChapters = [
    ...artworks.map((artwork) => artwork.title),
    "نمای گالری",
  ]

  return (
    <main className="landing-experience">
      <section
        className="museum-page"
        data-overlay-open={menuOpen || detailsOpen ? "true" : "false"}
        data-story-step={storyStep}
        dir="rtl"
        id="top"
        ref={rootRef}
      >
        <div className="museum-stage" aria-live="polite">
          {artworks.map((artwork, index) => {
            const isActive =
              index === activeArtworkIndex && storyStep < artworks.length

            return (
              <article
                aria-hidden={!isActive}
                aria-label={artwork.title}
                className="museum-scene"
                key={artwork.id}
              >
                <div
                  className="museum-artwork"
                  role="img"
                  aria-label={`${artwork.title}، اثر ${artwork.artist}`}
                  style={{
                    backgroundImage: `url(${artwork.image})`,
                    backgroundPosition: artwork.position,
                  }}
                />
                <div className="museum-shade" />

                <div className="museum-hero-copy">
                  <p className="museum-kicker">
                    {artwork.artist} <span aria-hidden="true">/</span>{" "}
                    {artwork.movement}
                  </p>
                  <h1 className="museum-title">
                    {artwork.titleLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h1>
                  <button
                    className="museum-primary-action"
                    onClick={() => setDetailsOpen(true)}
                    tabIndex={isActive ? 0 : -1}
                    type="button"
                  >
                    مشاهده اثر
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>

                <footer className="museum-footer">
                  <p className="museum-project-mark">
                    پروژه آنلاین
                    <span>هنر پالتو</span>
                  </p>

                  <dl className="museum-facts">
                    <div>
                      <dt>سال</dt>
                      <dd>{persianNumber.format(Number(artwork.year))}</dd>
                    </div>
                    <div>
                      <dt>ارتفاع</dt>
                      <dd>{persianNumber.format(Number(artwork.height))}</dd>
                    </div>
                    <div>
                      <dt>عرض</dt>
                      <dd>{persianNumber.format(Number(artwork.width))}</dd>
                    </div>
                  </dl>

                  <p className="museum-admission">
                    ورود
                    <span>رایگان</span>
                  </p>
                </footer>
              </article>
            )
          })}

          <section
            aria-hidden={storyStep !== artworks.length}
            aria-label="مرگ سقراط در گالری مجازی"
            className="museum-room"
          >
            <div className="museum-room-light museum-room-light--left" />
            <div className="museum-room-light museum-room-light--right" />

            <figure className="museum-room-side-frame museum-room-side-frame--left">
              <div />
            </figure>

            <figure className="museum-room-feature">
              <div
                aria-label="تابلوی مرگ سقراط، اثر ژاک-لویی داوید"
                className="museum-room-feature-image"
                role="img"
              />
            </figure>

            <figure className="museum-room-side-frame museum-room-side-frame--right">
              <div />
            </figure>

            <div className="museum-room-floor" />

            <div aria-hidden="true" className="museum-visitors">
              <span className="museum-visitor museum-visitor--one" />
              <span className="museum-visitor museum-visitor--two" />
              <span className="museum-visitor museum-visitor--three" />
            </div>

            <footer className="museum-room-footer">
              <p className="museum-project-mark">
                پروژه آنلاین
                <span>هنر پالتو</span>
              </p>
              <p className="museum-room-caption">
                مجموعه یک
                <span>نئوکلاسیسیسم</span>
              </p>
              <p className="museum-admission">
                ورود
                <span>رایگان</span>
              </p>
            </footer>
          </section>
        </div>

        <header className="museum-header">
          <button
            aria-label="بازگشت به نخستین اثر"
            className="museum-monogram"
            onClick={() => scrollToChapter(0)}
            type="button"
          >
            <span>M</span>P
          </button>

          <div className="museum-header-actions">
            <button
              className="museum-menu-label"
              onClick={() => setMenuOpen(true)}
              type="button"
            >
              موزه
            </button>
            <button
              aria-label="باز کردن فهرست موزه"
              className="museum-grid-button"
              onClick={() => setMenuOpen(true)}
              type="button"
            >
              <span />
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>

        <div className="museum-progress" aria-label="مسیر آثار">
          {storyChapters.map((chapter, index) => (
            <button
              aria-label={`نمایش ${chapter}`}
              aria-current={index === storyStep ? "step" : undefined}
              className={index === storyStep ? "is-active" : ""}
              key={chapter}
              onClick={() => scrollToChapter(index)}
              type="button"
            />
          ))}
        </div>

        <aside
          className={`museum-index${menuOpen ? "is-open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <div className="museum-index-topline">
            <p>آثار منتخب</p>
            <button
              aria-label="بستن فهرست موزه"
              onClick={() => setMenuOpen(false)}
              type="button"
            >
              بستن <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="museum-index-list">
            {artworks.map((artwork, index) => (
              <button
                className={index === activeArtworkIndex ? "is-active" : ""}
                key={artwork.id}
                onClick={() => {
                  setMenuOpen(false)
                  scrollToChapter(index)
                }}
                tabIndex={menuOpen ? 0 : -1}
                type="button"
              >
                <span className="museum-index-number">0{index + 1}</span>
                <span>{artwork.title}</span>
                <span>{persianNumber.format(Number(artwork.year))}</span>
              </button>
            ))}
          </div>
        </aside>

        <aside
          className={`museum-details${detailsOpen ? "is-open" : ""}`}
          aria-hidden={!detailsOpen}
        >
          <button
            aria-label="بستن اطلاعات اثر"
            className="museum-details-close"
            onClick={() => setDetailsOpen(false)}
            tabIndex={detailsOpen ? 0 : -1}
            type="button"
          >
            ×
          </button>
          <p className="museum-details-label">درباره اثر</p>
          <h2>{activeArtwork.title}</h2>
          <p>{activeArtwork.description}</p>
          <p className="museum-details-credit">
            {activeArtwork.artist}،{" "}
            {persianNumber.format(Number(activeArtwork.year))}
          </p>
        </aside>
      </section>

      <div className="studio-page min-h-screen" dir="rtl">
        <CustomCursor />
        <div className="studio-journey-track relative">
          <JourneyLine />
          <LandingMarqueeSection />
          <LandingIntroSection />
          <LandingJourneySection />
          <LandingStickySwitchSection />
          <LandingParallaxSection />
          <LandingHorizontalGallerySection />
          <LandingProjectGridSection />
        </div>
        <LandingFooterSection />
      </div>
    </main>
  )
}

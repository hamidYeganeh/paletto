"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"

import { galleryArtworks, type GalleryArtwork } from "../../components/artworks"
import {
  createGalleryScene,
  type GallerySceneHandle,
} from "../../components/GalleryScene"

gsap.registerPlugin(ScrollTrigger)

type GalleryDemoScreenProps = {
  /** Override default artworks — swap URLs to change wall images dynamically */
  artworks?: GalleryArtwork[]
}

export function GalleryDemoScreen({
  artworks = galleryArtworks,
}: GalleryDemoScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const railFillRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const plaqueTitleRef = useRef<HTMLSpanElement>(null)
  const plaqueMetaRef = useRef<HTMLSpanElement>(null)
  const handleRef = useRef<GallerySceneHandle | null>(null)
  const [ready, setReady] = useState(false)
  const [loadPct, setLoadPct] = useState(0)
  const artworksRef = useRef(artworks)

  artworksRef.current = artworks

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    let cancelled = false
    let raf = 0
    let ctx: gsap.Context | undefined
    let handle: GallerySceneHandle | null = null
    let needsRender = true
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const tick = () => {
      if (!handle || cancelled) return
      if (needsRender) {
        handle.render()
        needsRender = false
      }
      raf = requestAnimationFrame(tick)
    }

    const onResize = () => {
      if (!handle) return
      handle.resize(window.innerWidth, window.innerHeight)
      needsRender = true
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!handle) return
      // Normalized X: -1 (left) … +1 (right) — drives yaw look
      const x = (e.clientX / window.innerWidth) * 2 - 1
      handle.setLookYaw(x)
      needsRender = true
    }

    const syncCaption = (progress: number) => {
      const list = artworksRef.current
      if (!list.length) return
      const idx = Math.min(
        list.length - 1,
        Math.floor(progress * list.length)
      )
      const art = list[idx]
      if (!art) return
      if (labelRef.current) {
        labelRef.current.textContent = `${art.title} — ${art.artist}`
      }
      if (plaqueTitleRef.current) {
        plaqueTitleRef.current.textContent = art.title
      }
      if (plaqueMetaRef.current) {
        plaqueMetaRef.current.textContent = `${art.artist} · ${art.year}`
      }
    }

    ;(async () => {
      handle = await createGalleryScene(
        canvas,
        artworksRef.current,
        (loaded, total) => {
          if (!cancelled) setLoadPct(Math.round((loaded / total) * 100))
        }
      )
      if (cancelled) {
        handle.dispose()
        return
      }

      handleRef.current = handle
      onResize()
      setReady(true)
      needsRender = true
      syncCaption(0)

      window.addEventListener("pointermove", onPointerMove, { passive: true })

      if (reduced) {
        handle.setProgress(0.35)
        needsRender = true
        syncCaption(0.35)
        tick()
        return
      }

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            handle?.setProgress(self.progress)
            needsRender = true
            if (progressRef.current) {
              progressRef.current.textContent = `${Math.round(self.progress * 100)}٪`
            }
            if (railFillRef.current) {
              railFillRef.current.style.width = `${self.progress * 100}%`
            }
            syncCaption(self.progress)
          },
        })
      }, section)

      tick()
    })()

    window.addEventListener("resize", onResize)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("pointermove", onPointerMove)
      ctx?.revert()
      handle?.dispose()
      handleRef.current = null
    }
  }, [])

  const didMountArtworks = useRef(false)
  useEffect(() => {
    if (!ready) return
    if (!didMountArtworks.current) {
      didMountArtworks.current = true
      return
    }
    const h = handleRef.current
    if (!h) return
    void h.setArtworks(artworks)
  }, [artworks, ready])

  const first = artworks[0]

  return (
    <section ref={sectionRef} className="gallery-demo" aria-label="گالری سه‌بعدی">
      <div className="gallery-demo-sticky">
        <canvas ref={canvasRef} className="gallery-demo-canvas" />

        <div className="gallery-demo-ui">
          <header className="gallery-demo-header">
            <Link href="/" className="gallery-demo-brand">
              پالتو
            </Link>
            <p className="gallery-demo-mono">نگارخانه / پیمایش</p>
          </header>

          <div className="gallery-demo-footer">
            <div>
              <p className="gallery-demo-mono gallery-demo-hint">
                اسکرول برای حرکت · ماوس برای نگاه
              </p>
              <p ref={labelRef} className="gallery-demo-caption">
                {first ? `${first.title} — ${first.artist}` : ""}
              </p>
              <div className="gallery-demo-plaque" aria-hidden="true">
                <span ref={plaqueTitleRef} className="gallery-demo-plaque-title">
                  {first?.title ?? ""}
                </span>
                <span ref={plaqueMetaRef} className="gallery-demo-plaque-meta">
                  {first ? `${first.artist} · ${first.year}` : ""}
                </span>
              </div>
            </div>
            <p className="gallery-demo-mono">
              <span ref={progressRef}>۰٪</span>
            </p>
          </div>

          <div className="gallery-demo-rail" aria-hidden="true">
            <span ref={railFillRef} className="gallery-demo-rail-fill" />
          </div>
        </div>

        {!ready && (
          <div className="gallery-demo-loader" aria-live="polite">
            <div className="gallery-demo-loader-inner">
              <div className="gallery-demo-loader-ring" aria-hidden="true" />
              <p className="gallery-demo-mono">در حال ساخت گالری… {loadPct}٪</p>
            </div>
          </div>
        )}
      </div>

      <div className="gallery-demo-track" aria-hidden="true" />
    </section>
  )
}

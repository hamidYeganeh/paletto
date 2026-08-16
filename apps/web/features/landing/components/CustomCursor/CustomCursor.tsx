"use client"

import { useEffect, useRef } from "react"

const LERP = 0.18

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const coarse = window.matchMedia("(pointer: coarse)").matches
    if (reduced || coarse) return

    function onMove(e: MouseEvent) {
      const targetElement = e.target
      const isInsideStudio =
        targetElement instanceof Element &&
        Boolean(targetElement.closest(".studio-page"))

      cursor?.classList.toggle("is-visible", isInsideStudio)
      if (!isInsideStudio) return

      target.current.x = e.clientX
      target.current.y = e.clientY
    }

    function onOver(e: MouseEvent) {
      const el = e.target
      if (!(el instanceof Element)) return
      const interactive = el.closest(".studio-page a, .studio-page button")
      cursor?.classList.toggle("is-hover", Boolean(interactive))
    }

    function tick() {
      pos.current.x += (target.current.x - pos.current.x) * LERP
      pos.current.y += (target.current.y - pos.current.y) * LERP
      if (cursor) {
        cursor.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mouseover", onOver, { passive: true })
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseover", onOver)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div ref={cursorRef} className="studio-cursor" aria-hidden="true">
      <div className="studio-cursor-inner" />
    </div>
  )
}

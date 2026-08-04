"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, MotionConfig } from "motion/react"
import { ChevronDown } from "lucide-react"
import useMeasure from "react-use-measure"
import { cn } from "@workspace/ui/lib/utils"

export interface Topic {
  id: string
  title: string
}

export interface ScrollIslandProps {
  topics: Topic[]
  /** Label next to the progress ring. Default: "Index" */
  label?: string
  className?: string
}

export function ScrollIsland({
  topics,
  label = "Index",
  className,
}: ScrollIslandProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [ref, bounds] = useMeasure({ offsetSize: true })
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight

      if (scrollHeight > 0) {
        const progress = (scrollTop / scrollHeight) * 100
        setScrollProgress(Math.min(100, Math.max(0, progress)))
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current)
    }
  }, [])

  const handleTopicClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      el.classList.add("scroll-island-flash")
      window.setTimeout(() => el.classList.remove("scroll-island-flash"), 1800)
    }

    setActiveTopicId(id)
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current)
    flashTimeoutRef.current = setTimeout(() => setActiveTopicId(null), 1800)
    setIsOpen(false)
  }

  const islandUI = (
    <MotionConfig
      transition={{
        type: "spring",
        bounce: 0.2,
        duration: 0.7,
      }}
    >
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-6 z-[90] flex justify-center",
          className
        )}
      >
        <motion.div
          className="pointer-events-auto flex cursor-none flex-col items-center overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl"
          initial={{ borderRadius: 32 }}
          animate={{
            height: bounds.height > 0 ? bounds.height : "auto",
            width: isOpen ? 400 : 240,
            borderRadius: isOpen ? 24 : 32,
          }}
        >
          <div ref={ref} className="flex w-full flex-col items-center px-4">
            <button
              type="button"
              className="group flex h-13 w-full cursor-pointer items-center justify-between gap-8 select-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="scroll-island-topics"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  layout
                  className="relative h-7 w-7 shrink-0 rounded-full"
                  style={{
                    background: `conic-gradient(white ${scrollProgress}%, #333 0)`,
                  }}
                  aria-hidden
                >
                  <div className="absolute inset-[2.5px] rounded-full bg-black" />
                </motion.div>

                <motion.span
                  layout
                  className="text-lg font-medium text-white"
                >
                  {label}
                </motion.span>

                <motion.div layout animate={{ rotate: isOpen ? 180 : 0 }}>
                  <ChevronDown
                    size={20}
                    className="text-neutral-400 group-hover:text-white"
                  />
                </motion.div>
              </div>

              <motion.div
                layout
                className="flex items-center justify-center rounded-full bg-zinc-800 px-2.5 text-lg font-bold text-zinc-200 tabular-nums"
                aria-label={`${Math.round(scrollProgress)}%`}
              >
                {Math.round(scrollProgress)}%
              </motion.div>
            </button>

            <AnimatePresence mode="popLayout">
              {isOpen && (
                <motion.div
                  id="scroll-island-topics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="scroll-island-scrollbar max-h-[60vh] w-full overflow-y-auto pt-2 pb-4"
                >
                  <div className="mx-2 mb-2 h-px bg-white/5" />
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleTopicClick(topic.id)}
                      className={cn(
                        "w-full truncate rounded-xl py-2 text-start text-sm text-zinc-400 transition-colors hover:text-white",
                        activeTopicId === topic.id && "text-white"
                      )}
                    >
                      {topic.title}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] cursor-none bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  )

  if (!mounted) return null

  return createPortal(islandUI, document.body)
}

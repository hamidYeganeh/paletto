"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Plus, X } from "lucide-react"

const NAV_LINKS = [
  { href: "/artworks", key: "marketplace" as const },
  { href: "/artists", key: "artists" as const },
  { href: "/exhibitions", key: "exhibitions" as const },
  { href: "/gallery/demo?exhibition=opening-hall", key: "gallery3d" as const },
  { href: "#intro", key: "about" as const },
  { href: "/auth/login", key: "login" as const },
]

export function LandingHeader() {
  const t = useTranslations("Nav")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between px-6 py-6 text-white">
          <a
            href="#top"
            className="studio-headline text-2xl leading-none tracking-tighter"
          >
            {t("logo")}
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="studio-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center text-white transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:rotate-90"
          >
            {open ? (
              <X size={24} strokeWidth={1.5} />
            ) : (
              <Plus size={24} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </header>

      <div
        id="studio-menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col justify-center bg-white px-6"
        role="dialog"
        aria-modal="true"
      >
        <nav className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="studio-headline text-[12vw] leading-[0.9] tracking-tighter text-black transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:opacity-40 md:text-7xl"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

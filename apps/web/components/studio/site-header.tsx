"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, X } from "lucide-react"

const NAV_LINKS = [
  { href: "#intro", key: "about" as const },
  { href: "#works", key: "works" as const },
  { href: "#contact", key: "contact" as const },
]

export function SiteHeader() {
  const t = useTranslations("Nav")
  const [open, setOpen] = useState(false)

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
            {open ? <X size={24} strokeWidth={1.5} /> : <Plus size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      <div
        id="studio-menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col justify-center bg-white px-6"
      >
        <nav className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="studio-headline text-[12vw] leading-[0.9] tracking-tighter text-black transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:opacity-40 md:text-7xl"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}

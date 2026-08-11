"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"

const links = [
  { href: "/", label: "خانه" },
  { href: "/artworks", label: "آثار" },
  { href: "/artists", label: "هنرمندان" },
  { href: "/exhibitions", label: "نمایشگاه‌ها" },
  { href: "/commissions", label: "کمیسیون" },
  { href: "/gallery/demo?exhibition=opening-hall", label: "گالری ۳بعدی" },
  { href: "/auth/login", label: "ورود" },
  { href: "/dashboard", label: "داشبورد" },
]

export function SiteNav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f7f3eb]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="font-[family-name:var(--font-space-grotesk)] text-lg tracking-tight"
        >
          پَلِتو
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname === l.href.split("?")[0] ||
                  pathname.startsWith(`${l.href.split("?")[0]}/`)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 transition-colors hover:bg-black/5",
                  active ? "bg-black/8 font-medium" : "text-black/70"
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

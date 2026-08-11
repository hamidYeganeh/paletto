import { SiteNav } from "@/components/site-nav"

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f7f3eb] text-zinc-900">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}

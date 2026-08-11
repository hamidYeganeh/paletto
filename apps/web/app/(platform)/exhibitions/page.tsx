import Link from "next/link"
import { apiServer, type Paginated } from "@/lib/api"
import type { ExhibitionDto } from "@workspace/shared"

export default async function ExhibitionsPage() {
  let items: ExhibitionDto[] = []
  try {
    const res = await apiServer<Paginated<ExhibitionDto>>("/exhibitions")
    items = res.items
  } catch {
    items = []
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl">
        نمایشگاه‌های مجازی
      </h1>
      <p className="mt-2 text-zinc-600">گالری‌های ۳بعدی عمومی پالتو</p>
      <ul className="mt-8 space-y-4">
        {items.map((ex) => (
          <li key={ex.id} className="border border-zinc-200 bg-white/50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl">{ex.title}</h2>
                {ex.description ? (
                  <p className="mt-1 text-sm text-zinc-600">{ex.description}</p>
                ) : null}
              </div>
              <div className="flex gap-3 text-sm">
                <Link href={`/exhibitions/${ex.slug}`} className="underline">
                  جزئیات
                </Link>
                <Link
                  href={`/gallery/demo?exhibition=${ex.slug}`}
                  className="underline"
                >
                  ورود ۳بعدی
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 ? (
        <p className="mt-6 text-zinc-500">نمایشگاهی منتشر نشده است.</p>
      ) : null}
    </div>
  )
}

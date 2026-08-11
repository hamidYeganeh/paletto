import Link from "next/link"
import { apiServer, type Paginated } from "@/lib/api"
import type { ArtistProfileDto } from "@workspace/shared"

export default async function ArtistsPage() {
  let items: ArtistProfileDto[] = []
  try {
    const res = await apiServer<Paginated<ArtistProfileDto>>("/artists")
    items = res.items
  } catch {
    items = []
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl">
        هنرمندان
      </h1>
      <p className="mt-2 text-zinc-600">پروفایل و پورتفولیو حرفه‌ای</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((a) => (
          <li key={a.id} className="border border-zinc-200 bg-white/60 p-5">
            <Link href={`/artists/${a.slug}`} className="block">
              <h2 className="text-xl">{a.displayName}</h2>
              {a.bio ? (
                <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{a.bio}</p>
              ) : null}
              {a.location ? (
                <p className="mt-2 text-xs text-zinc-500">{a.location}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
      {items.length === 0 ? (
        <p className="mt-6 text-zinc-500">هنرمندی یافت نشد — API را اجرا کنید.</p>
      ) : null}
    </div>
  )
}

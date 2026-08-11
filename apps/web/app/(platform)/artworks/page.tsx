import Link from "next/link"
import Image from "next/image"
import { apiServer, type Paginated } from "@/lib/api"
import type { ArtworkDto } from "@workspace/shared"

export default async function ArtworksPage() {
  let items: ArtworkDto[] = []
  let error: string | null = null
  try {
    const res = await apiServer<Paginated<ArtworkDto>>("/artworks?limit=24")
    items = res.items
  } catch {
    error = "اتصال به سرور برقرار نشد. API را اجرا کنید."
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl">
            بازار آثار
          </h1>
          <p className="mt-2 text-zinc-600">
            کشف، خرید و سفارش اثر از هنرمندان پالتو
          </p>
        </div>
        <Link href="/dashboard" className="text-sm underline underline-offset-4">
          پنل هنرمند
        </Link>
      </div>

      {error ? (
        <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-6 text-amber-900">
          {error}
        </p>
      ) : null}

      {!error && items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
          هنوز اثری منتشر نشده است.
        </p>
      ) : null}

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((art) => (
          <li key={art.id}>
            <Link href={`/artworks/${art.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-zinc-200">
                {art.images[0] ? (
                  <Image
                    src={art.images[0]}
                    alt={art.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                ) : null}
              </div>
              <div className="mt-3">
                <h2 className="font-medium">{art.title}</h2>
                <p className="text-sm text-zinc-600">
                  {art.price.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

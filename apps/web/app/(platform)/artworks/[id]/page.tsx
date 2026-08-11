import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { apiServer } from "@/lib/api"
import type { ArtworkDto } from "@workspace/shared"
import { BuyArtworkButton } from "@/features/marketplace/BuyArtworkButton"

type Props = { params: Promise<{ id: string }> }

export default async function ArtworkDetailPage({ params }: Props) {
  const { id } = await params
  let art: ArtworkDto
  try {
    art = await apiServer<ArtworkDto>(`/artworks/${id}`)
  } catch {
    notFound()
  }

  const canBuy = art.status === "published"

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="relative aspect-[4/5] bg-zinc-200">
        {art.images[0] ? (
          <Image
            src={art.images[0]}
            alt={art.title}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
            priority
          />
        ) : null}
      </div>
      <div>
        <p className="text-sm text-zinc-500">{art.medium} · {art.status}</p>
        <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl">
          {art.title}
        </h1>
        {art.description ? (
          <p className="mt-4 leading-7 text-zinc-700">{art.description}</p>
        ) : null}
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          {art.year ? (
            <>
              <dt className="text-zinc-500">سال</dt>
              <dd>{art.year}</dd>
            </>
          ) : null}
          <dt className="text-zinc-500">قیمت</dt>
          <dd className="text-lg font-medium">
            {art.price.toLocaleString("fa-IR")} تومان
          </dd>
          <dt className="text-zinc-500">بازدید</dt>
          <dd>{art.viewsCount.toLocaleString("fa-IR")}</dd>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <BuyArtworkButton artworkId={art.id} disabled={!canBuy} />
          <Link
            href="/artists"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm"
          >
            هنرمندان
          </Link>
          {!canBuy ? (
            <p className="w-full text-sm text-zinc-500">این اثر فعلاً قابل خرید نیست.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

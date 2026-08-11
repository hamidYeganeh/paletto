import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { apiServer, type Paginated } from "@/lib/api"
import type { ArtistProfileDto, ArtworkDto } from "@workspace/shared"

type Props = { params: Promise<{ slug: string }> }

export default async function ArtistProfilePage({ params }: Props) {
  const { slug } = await params
  let artist: ArtistProfileDto
  try {
    artist = await apiServer<ArtistProfileDto>(`/artists/${slug}`)
  } catch {
    notFound()
  }

  let artworks: ArtworkDto[] = []
  try {
    const res = await apiServer<Paginated<ArtworkDto>>(
      `/artworks?artistId=${artist.userId}`
    )
    artworks = res.items
  } catch {
    artworks = []
  }

  return (
    <div>
      <div className="border-b border-zinc-200 pb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl">
          {artist.displayName}
        </h1>
        {artist.bio ? (
          <p className="mt-3 max-w-2xl text-zinc-700">{artist.bio}</p>
        ) : null}
        <div className="mt-4 flex gap-3 text-sm">
          <Link
            href={`/commissions?artist=${artist.userId}`}
            className="underline"
          >
            درخواست کمیسیون
          </Link>
        </div>
      </div>
      <h2 className="mt-8 text-lg">پورتفولیو</h2>
      <ul className="mt-4 grid gap-5 sm:grid-cols-3">
        {artworks.map((art) => (
          <li key={art.id}>
            <Link href={`/artworks/${art.id}`}>
              <div className="relative aspect-square bg-zinc-200">
                {art.images[0] ? (
                  <Image
                    src={art.images[0]}
                    alt={art.title}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                ) : null}
              </div>
              <p className="mt-2 text-sm">{art.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

import type { Metadata } from "next"

import { GalleryDemoScreen } from "@/features/gallery"
import {
  galleryArtworks,
  type GalleryArtwork,
} from "@/features/gallery/components/artworks"
import { apiServer } from "@/lib/api"
import type { ArtworkDto, ExhibitionDto } from "@workspace/shared"
import "@/app/gallery-demo.css"

export const metadata: Metadata = {
  title: "گالری ۳بعدی — پالتو",
  description: "بازدید مجازی از نمایشگاه و آثار روی دیوار.",
}

type Props = { searchParams: Promise<{ exhibition?: string }> }

export default async function GalleryDemoPage({ searchParams }: Props) {
  const { exhibition } = await searchParams
  let artworks = galleryArtworks

  if (exhibition) {
    try {
      const ex = await apiServer<ExhibitionDto>(`/exhibitions/${exhibition}`)
      const mapped: GalleryArtwork[] = []
      for (const [idx, id] of ex.artworkIds.entries()) {
        try {
          const art = await apiServer<ArtworkDto>(`/artworks/${id}`)
          mapped.push({
            id: art.id,
            src:
              art.images[0] ??
              galleryArtworks[idx % galleryArtworks.length]!.src,
            title: art.title,
            artist: "پالتو",
            year: art.year ? String(art.year) : "—",
            aspect: 0.8,
            scale: 1,
          })
        } catch {
          /* skip */
        }
      }
      if (mapped.length) artworks = mapped
    } catch {
      /* keep demo defaults */
    }
  }

  return <GalleryDemoScreen artworks={artworks} />
}

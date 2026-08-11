import Link from "next/link"
import { notFound } from "next/navigation"
import { apiServer } from "@/lib/api"
import type { ExhibitionDto } from "@workspace/shared"

type Props = { params: Promise<{ slug: string }> }

export default async function ExhibitionDetailPage({ params }: Props) {
  const { slug } = await params
  let ex: ExhibitionDto
  try {
    ex = await apiServer<ExhibitionDto>(`/exhibitions/${slug}`)
  } catch {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-zinc-500">{ex.status}</p>
      <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl">
        {ex.title}
      </h1>
      {ex.description ? (
        <p className="mt-4 leading-7 text-zinc-700">{ex.description}</p>
      ) : null}
      <p className="mt-4 text-sm text-zinc-500">
        تعداد آثار: {(ex.artworkIds?.length ?? 0).toLocaleString("fa-IR")}
      </p>
      <Link
        href={`/gallery/demo?exhibition=${ex.slug}`}
        className="mt-8 inline-block rounded-md bg-zinc-900 px-5 py-2.5 text-sm text-white"
      >
        ورود به گالری سه‌بعدی
      </Link>
    </div>
  )
}

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-medium">صفحه پیدا نشد</h1>
      <p className="mt-2 text-zinc-600">این مسیر در پالتو وجود ندارد.</p>
      <Link href="/artworks" className="mt-6 underline">
        بازگشت به بازار آثار
      </Link>
    </div>
  )
}

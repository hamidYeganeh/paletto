"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="grid min-h-screen place-items-center bg-[#f7f3eb] px-4 text-center">
        <div>
          <h1 className="text-2xl font-medium">خطایی رخ داد</h1>
          <p className="mt-2 text-sm text-zinc-600">{error.message}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white"
          >
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  )
}

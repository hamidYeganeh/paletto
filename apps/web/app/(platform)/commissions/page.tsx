"use client"

import { FormEvent, Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/api"

type Commission = {
  id: string
  title: string
  description: string
  status: string
  budget?: number
}

function CommissionsClient() {
  const router = useRouter()
  const search = useSearchParams()
  const artistId = search.get("artist") ?? ""
  const [items, setItems] = useState<Commission[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState("5000000")
  const [targetArtist, setTargetArtist] = useState(artistId)
  const [error, setError] = useState<string | null>(null)

  function load() {
    api<{ items: Commission[] }>("/commissions/sent")
      .then((res) => setItems(res.items))
      .catch(() => setItems([]))
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (artistId) setTargetArtist(artistId)
  }, [artistId])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!targetArtist) {
      setError("شناسه هنرمند لازم است — از صفحه هنرمند وارد شوید یا ID را وارد کنید.")
      return
    }
    try {
      await api("/commissions", {
        method: "POST",
        body: JSON.stringify({
          artistId: targetArtist,
          title,
          description,
          budget: Number(budget),
        }),
      })
      setTitle("")
      setDescription("")
      load()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "خطا"
      if (/unauthorized|jwt/i.test(msg)) {
        router.push("/auth/login")
        return
      }
      setError(msg)
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl">
          کمیسیون
        </h1>
        <p className="mt-2 text-zinc-600">
          درخواست سفارش سفارشی مستقیم به یک هنرمند
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            className="w-full border border-zinc-300 px-3 py-2"
            placeholder="شناسه کاربر هنرمند"
            value={targetArtist}
            onChange={(e) => setTargetArtist(e.target.value)}
            dir="ltr"
            required
          />
          <input
            className="w-full border border-zinc-300 px-3 py-2"
            placeholder="عنوان سفارش"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="min-h-28 w-full border border-zinc-300 px-3 py-2"
            placeholder="توضیحات"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            className="w-full border border-zinc-300 px-3 py-2"
            placeholder="بودجه تقریبی"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            dir="ltr"
          />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white"
          >
            ثبت درخواست
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-lg">درخواست‌های ارسالی من</h2>
        <ul className="mt-4 space-y-3">
          {items.map((c) => (
            <li key={c.id} className="border border-zinc-200 bg-white/50 p-4 text-sm">
              <p className="font-medium">{c.title}</p>
              <p className="mt-1 text-zinc-600">{c.description}</p>
              <p className="mt-2 text-xs text-zinc-500">{c.status}</p>
            </li>
          ))}
          {items.length === 0 ? (
            <li className="text-zinc-500">موردی نیست (نیاز به ورود).</li>
          ) : null}
        </ul>
      </div>
    </div>
  )
}

export default function CommissionsPage() {
  return (
    <Suspense fallback={<p className="text-zinc-500">بارگذاری...</p>}>
      <CommissionsClient />
    </Suspense>
  )
}

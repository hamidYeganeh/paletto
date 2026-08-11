"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api, setToken, type Paginated } from "@/lib/api"
import type { UserDto } from "@workspace/shared"

type AuthUser = Pick<UserDto, "id" | "phone" | "name" | "role">

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [orders, setOrders] = useState<{ id: string; status: string; totalAmount: number }[]>([])
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("10000000")
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200"
  )
  const [exTitle, setExTitle] = useState("نمایشگاه من")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<UserDto>("/users/me")
      .then((u) => setUser(u))
      .catch(() => router.push("/auth/login"))
    api<Paginated<{ id: string; status: string; totalAmount: number }>>("/orders/me")
      .then((res) => setOrders(res.items))
      .catch(() => setOrders([]))
  }, [router])

  async function becomeArtist(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await api<{
        accessToken?: string
        user?: AuthUser
      }>("/artists/me", {
        method: "POST",
        body: JSON.stringify({
          displayName: user?.name || "هنرمند پالتو",
          bio: "پروفایل هنرمند در پالتو",
          location: "تهران",
        }),
      })
      if (res.accessToken) setToken(res.accessToken)
      if (res.user) setUser(res.user)
      setMessage("نقش هنرمند فعال شد.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا")
    }
  }

  async function createArtwork(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await api("/artworks", {
        method: "POST",
        body: JSON.stringify({
          title,
          price: Number(price),
          medium: "painting",
          images: [imageUrl],
        }),
      })
      setMessage("اثر منتشر شد")
      setTitle("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا")
    }
  }

  async function createExhibition(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const slug = `ex-${Date.now().toString(36)}`
      const ex = await api<{ slug: string }>("/exhibitions", {
        method: "POST",
        body: JSON.stringify({
          title: exTitle,
          slug,
          description: "نمایشگاه مجازی از داشبورد هنرمند",
          status: "open",
        }),
      })
      setMessage(`نمایشگاه ساخته شد: ${ex.slug}`)
      router.push(`/gallery/demo?exhibition=${ex.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا")
    }
  }

  if (!user) {
    return <p className="text-zinc-500">در حال بارگذاری...</p>
  }

  const isArtist = user.role === "artist" || user.role === "admin"

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl">
            داشبورد
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            {user.name || user.phone} · نقش: {user.role}
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          {user.role === "admin" ? (
            <Link href="/admin" className="underline">
              پنل ادمین
            </Link>
          ) : null}
          <button
            type="button"
            className="underline"
            onClick={() => {
              setToken(null)
              router.push("/auth/login")
            }}
          >
            خروج
          </button>
        </div>
      </div>

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {!isArtist ? (
        <section className="border border-zinc-200 p-5">
          <h2 className="text-lg">فعال‌سازی پروفایل هنرمند</h2>
          <p className="mt-1 text-sm text-zinc-600">
            برای آپلود اثر و ساخت نمایشگاه ۳بعدی
          </p>
          <form onSubmit={becomeArtist} className="mt-3">
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white"
            >
              تبدیل به هنرمند
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="border border-zinc-200 p-5">
            <h2 className="text-lg">آپلود اثر</h2>
            <form onSubmit={createArtwork} className="mt-4 grid max-w-lg gap-3">
              <input
                className="border border-zinc-300 px-3 py-2"
                placeholder="عنوان"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                className="border border-zinc-300 px-3 py-2"
                placeholder="قیمت (تومان)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                dir="ltr"
              />
              <input
                className="border border-zinc-300 px-3 py-2"
                placeholder="URL تصویر"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                dir="ltr"
              />
              <button
                type="submit"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white"
              >
                انتشار
              </button>
            </form>
          </section>
          <section className="border border-zinc-200 p-5">
            <h2 className="text-lg">نمایشگاه ۳بعدی</h2>
            <form
              onSubmit={createExhibition}
              className="mt-4 flex max-w-lg flex-wrap gap-3"
            >
              <input
                className="min-w-[12rem] flex-1 border border-zinc-300 px-3 py-2"
                value={exTitle}
                onChange={(e) => setExTitle(e.target.value)}
                required
              />
              <button
                type="submit"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white"
              >
                ایجاد
              </button>
            </form>
          </section>
        </>
      )}

      <section>
        <h2 className="text-lg">سفارش‌های من</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {orders.map((o) => (
            <li key={o.id} className="border border-zinc-200 px-3 py-2">
              {o.status} — {(o.totalAmount ?? 0).toLocaleString("fa-IR")} تومان
            </li>
          ))}
          {orders.length === 0 ? (
            <li className="text-zinc-500">سفارشی ندارید.</li>
          ) : null}
        </ul>
      </section>
    </div>
  )
}

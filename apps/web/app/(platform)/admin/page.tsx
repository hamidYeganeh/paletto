"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

type Dash = {
  totalUsers: number
  totalArtists: number
  totalArtworks: number
  totalOrders: number
  totalCommissions: number
  totalRevenue: number
}

export default function AdminPage() {
  const router = useRouter()
  const [data, setData] = useState<Dash | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<Dash>("/admin/dashboard")
      .then(setData)
      .catch((e) => {
        setError(e instanceof Error ? e.message : "خطا")
        if (/unauthorized|forbidden/i.test(String(e))) {
          router.push("/auth/login")
        }
      })
  }, [router])

  return (
    <div>
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl">
        پنل ادمین
      </h1>
      {error ? <p className="mt-4 text-red-700">{error}</p> : null}
      {data ? (
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {(
            [
              ["کاربران", data.totalUsers],
              ["هنرمندان", data.totalArtists],
              ["آثار", data.totalArtworks],
              ["سفارش‌ها", data.totalOrders],
              ["کمیسیون‌ها", data.totalCommissions],
              ["درآمد", data.totalRevenue],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="border border-zinc-200 bg-white/60 p-4">
              <dt className="text-xs text-zinc-500">{label}</dt>
              <dd className="mt-2 text-2xl">
                {Number(value).toLocaleString("fa-IR")}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        !error && <p className="mt-6 text-zinc-500">در حال بارگذاری...</p>
      )}
    </div>
  )
}

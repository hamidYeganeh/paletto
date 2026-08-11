"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api, setToken } from "@/lib/api"

export function BuyArtworkButton({
  artworkId,
  disabled,
}: {
  artworkId: string
  disabled?: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function buy() {
    setLoading(true)
    setError(null)
    try {
      const order = await api<{ id: string }>("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: [{ artworkId, quantity: 1 }],
          shippingAddress: {
            fullName: "خریدار پالتو",
            phone: "09120000000",
            addressLine1: "تهران",
            city: "تهران",
            country: "IR",
          },
        }),
      })
      await api(`/orders/${order.id}/pay`, { method: "POST" })
      router.push("/dashboard")
    } catch (e) {
      const msg = e instanceof Error ? e.message : "خطا در خرید"
      if (/unauthorized|jwt|token/i.test(msg)) {
        setToken(null)
        router.push("/auth/login")
        return
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled || loading}
        onClick={buy}
        className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm text-white disabled:opacity-50"
      >
        {loading ? "در حال پرداخت..." : "خرید امن"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  )
}

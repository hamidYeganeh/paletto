"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api, setToken } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState("09120000001")
  const [code, setCode] = useState("123456")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [devCode, setDevCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function requestOtp() {
    setLoading(true)
    setError(null)
    try {
      const res = await api<{ ok?: boolean; devCode?: string }>(
        "/auth/otp/request",
        { method: "POST", body: JSON.stringify({ phone }) }
      )
      setDevCode(res.devCode ?? "123456")
      if (res.devCode) setCode(res.devCode)
      setStep("otp")
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا")
    } finally {
      setLoading(false)
    }
  }

  async function verify() {
    setLoading(true)
    setError(null)
    try {
      const res = await api<{ accessToken: string }>("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code }),
      })
      setToken(res.accessToken)
      router.push("/dashboard")
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl">
        ورود با موبایل
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        OTP برای ایران — در حالت توسعه کد ثابت ۱۲۳۴۵۶
      </p>
      <div className="mt-8 space-y-4">
        <label className="block text-sm">
          شماره موبایل
          <input
            className="mt-1 w-full border border-zinc-300 bg-white px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
          />
        </label>
        {step === "otp" ? (
          <label className="block text-sm">
            کد تأیید
            <input
              className="mt-1 w-full border border-zinc-300 bg-white px-3 py-2"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              dir="ltr"
            />
          </label>
        ) : null}
        {devCode ? (
          <p className="text-xs text-emerald-700">کد توسعه: {devCode}</p>
        ) : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {step === "phone" ? (
          <button
            type="button"
            disabled={loading}
            onClick={requestOtp}
            className="w-full rounded-md bg-zinc-900 py-2.5 text-white"
          >
            دریافت کد
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={verify}
            className="w-full rounded-md bg-zinc-900 py-2.5 text-white"
          >
            ورود
          </button>
        )}
      </div>
    </div>
  )
}

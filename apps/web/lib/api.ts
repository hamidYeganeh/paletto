const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/api/v1"

export type ApiError = { statusCode?: number; message?: string | string[] }

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("paletto_token")
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return
  if (token) localStorage.setItem("paletto_token", token)
  else localStorage.removeItem("paletto_token")
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json")
  }
  const token = getToken()
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const body = (await res.json()) as ApiError
      message = Array.isArray(body.message)
        ? body.message.join(", ")
        : body.message || message
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function apiServer<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json() as Promise<T>
}

export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  limit: number
}

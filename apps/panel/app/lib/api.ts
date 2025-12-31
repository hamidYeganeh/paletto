import { getAuthToken } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export type ApiError = {
  message: string;
  status: number;
};

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  headers?: HeadersInit;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, token, headers } = options;
  const authToken = token ?? getAuthToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = (await response.json()) as { message?: string };
      if (data?.message) message = data.message;
    } catch {
      // ignore parse error
    }

    const error: ApiError = {
      message,
      status: response.status,
    };
    throw error;
  }

  return (await response.json()) as T;
}

export function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    query.set(key, String(value));
  });
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

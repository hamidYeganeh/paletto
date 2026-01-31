import { API_BASE_URL, DEFAULT_HEADERS } from "./config";
import { getAuthToken } from "../session";

type Primitive = string | number | boolean | null | undefined;

export type RequestConfig<TBody = unknown> = {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, Primitive>;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
  cache?: RequestCache;
};

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const buildUrl = (path: string, query?: Record<string, Primitive>) => {
  const url = new URL(path, API_BASE_URL);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

async function request<TResponse, TBody = unknown>({
  path,
  method = "GET",
  query,
  body,
  headers,
  signal,
  cache = "no-store",
}: RequestConfig<TBody>): Promise<TResponse> {
  const url = buildUrl(path, query);
  const authToken = getAuthToken();
  const response = await fetch(url, {
    method,
    headers: {
      ...DEFAULT_HEADERS,
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
    cache,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      payload,
    );
  }

  return payload as TResponse;
}

export const http = {
  get: <TResponse>(
    path: string,
    config?: Omit<RequestConfig, "path" | "method">,
  ) =>
    request<TResponse>({
      path,
      method: "GET",
      ...config,
    }),
  post: <TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, "path" | "method" | "body">,
  ) =>
    request<TResponse, TBody>({
      path,
      method: "POST",
      body,
      ...config,
    }),
  put: <TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, "path" | "method" | "body">,
  ) =>
    request<TResponse, TBody>({
      path,
      method: "PUT",
      body,
      ...config,
    }),
  patch: <TResponse, TBody = unknown>(
    path: string,
    body?: TBody,
    config?: Omit<RequestConfig<TBody>, "path" | "method" | "body">,
  ) =>
    request<TResponse, TBody>({
      path,
      method: "PATCH",
      body,
      ...config,
    }),
  delete: <TResponse>(
    path: string,
    config?: Omit<RequestConfig, "path" | "method">,
  ) =>
    request<TResponse>({
      path,
      method: "DELETE",
      ...config,
    }),
};

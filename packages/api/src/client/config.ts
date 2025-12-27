export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
};

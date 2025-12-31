import { ApiError } from "@repo/api";

type MaybeMessage = { message?: string };

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    if (typeof error.payload === "string") {
      return error.payload;
    }

    const payload = error.payload as MaybeMessage | undefined;
    if (payload?.message) {
      return String(payload.message);
    }

    return error.message || fallback;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String((error as MaybeMessage).message ?? fallback);
  }

  return fallback;
}

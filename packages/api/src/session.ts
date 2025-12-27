const AUTH_TOKEN_KEY = "paletto/auth-token";

let memoryToken: string | null = null;

const canUseStorage = () => typeof window !== "undefined";

export function getAuthToken(): string | null {
  if (memoryToken) return memoryToken;

  if (!canUseStorage()) return null;

  const stored = window.localStorage.getItem(AUTH_TOKEN_KEY);
  memoryToken = stored;
  return stored;
}

export function setAuthToken(token: string | null) {
  memoryToken = token;

  if (!canUseStorage()) return;

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

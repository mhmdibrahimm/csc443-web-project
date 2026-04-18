/**
 * Thin fetch wrapper for the Velo API.
 *
 * - Reads the base URL from `VITE_API_URL`; dev falls back to localhost,
 *   while production falls back to same-origin Vercel API routes.
 * - Reads the JWT from localStorage and adds it as a Bearer token when present.
 * - Throws an `ApiError` with `.status` and the server-provided message on
 *   non-2xx responses, so callers can render friendly errors.
 */

const BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:3001" : "");
const TOKEN_KEY = "velo:auth-token";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function apiFetch(path, { method = "GET", body, signal } = {}) {
  const headers = { Accept: "application/json" };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  // 204 No Content — nothing to parse.
  if (res.status === 204) return null;

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // Non-JSON response — fall through with `payload` left null.
  }

  if (!res.ok) {
    throw new ApiError(payload?.error || `Request failed (${res.status})`, res.status);
  }

  return payload;
}

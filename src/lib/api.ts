/**
 * Centralized API client. In mock data mode, requests are answered by the in-browser sample
 * provider. In api mode, requests go to the Laravel API and failures are surfaced to the user,
 * never replaced with sample records. Base URL: NEXT_PUBLIC_API_BASE_URL.
 * Every request in the app goes through `api`; never call fetch() directly in pages.
 */

import { ApiError, type FieldErrors } from "./api-error";
import { DATA_MODE } from "./data-mode";
import { mockRequest } from "@/mocks/mock-api";

export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

const TOKEN_KEY = "lena_auth_token";

export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    if (typeof window !== "undefined") window.localStorage.removeItem(TOKEN_KEY);
  },
};

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export type QueryValue = string | number | boolean | null | undefined;

/** Serialize query params consistently: drop empty values, keep stable order. */
export function toQueryString(params?: Record<string, QueryValue>): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  Object.keys(params)
    .sort()
    .forEach((key) => {
      const v = params[key];
      if (v === undefined || v === null || v === "") return;
      sp.append(key, typeof v === "boolean" ? (v ? "1" : "0") : String(v));
    });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

type Listener = () => void;
const unauthorizedListeners = new Set<Listener>();
export function onUnauthorized(fn: Listener) {
  unauthorizedListeners.add(fn);
  return () => unauthorizedListeners.delete(fn);
}

interface RequestOptions {
  query?: Record<string, QueryValue> | undefined;
  body?: unknown;
  signal?: AbortSignal | undefined;
}

async function request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
  if (DATA_MODE === "mock") return mockRequest<T>(method, path, opts.query ?? {}, opts.body);

  if (!API_BASE_URL) {
    throw new ApiError("The live property service isn't connected yet. Nothing has been submitted.", 0);
  }
  const token = tokenStore.get();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let body: BodyInit | null = null;
  if (opts.body instanceof FormData) {
    // Let the browser set the multipart boundary.
    body = opts.body;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}${toQueryString(opts.query)}`, {
      method,
      headers,
      body,
      signal: opts.signal ?? null,
      credentials: "include",
    });
  } catch (error) {
    if (opts.signal?.aborted) throw error;
    throw new ApiError("We couldn't reach the server. Check your connection and try again.", 0);
  }

  if (res.status === 204) return undefined as T;
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    const err = normalizeError(res.status, json);
    if (err.isUnauthorized) {
      tokenStore.clear();
      unauthorizedListeners.forEach((l) => l());
    }
    throw err;
  }
  return json as T;
}

export function normalizeError(status: number, json: any): ApiError {
  const errors: FieldErrors = json?.errors && typeof json.errors === "object" ? json.errors : {};
  let message: string = json?.message ?? "";
  if (!message) {
    if (status === 401 || status === 419) message = "Your session has expired. Please sign in again.";
    else if (status === 403) message = "You don't have permission to do that.";
    else if (status === 404) message = "We couldn't find what you were looking for.";
    else if (status === 422) message = "Please correct the highlighted fields.";
    else if (status >= 500) message = "The server ran into a problem. Please try again shortly.";
    else message = "Something went wrong.";
  }
  return new ApiError(message, status, errors);
}

/** Laravel resources may return { data: T } or T. */
export function unwrap<T>(res: T | { data: T }): T {
  if (res && typeof res === "object" && "data" in (res as any) && !Array.isArray(res)) {
    return (res as { data: T }).data;
  }
  return res as T;
}
 
/** Normalize Laravel pagination (resource collection or paginator). */
export function toPaginated<T>(res: any): Paginated<T> {
  const data: T[] = Array.isArray(res) ? res : (res?.data ?? []);
  const m = res?.meta ?? res ?? {};

  return {
    data,
    meta: {
      current_page: Number(m.current_page ?? 1),
      last_page: Number(m.last_page ?? 1),
      per_page: Number(m.per_page ?? data.length),
      total: Number(m.total ?? data.length),
    },
  };
}

export const api = {
  get: <T>(path: string, query?: Record<string, QueryValue>, signal?: AbortSignal) =>
    request<T>("GET", path, { query, signal }),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, { body }),
  delete: <T>(path: string) => request<T>("DELETE", path),
};


// For dashboard only
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json', Accept: 'application/json' }),
      ...options.headers,
    },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(payload?.message ?? 'Something went wrong. Please try again.', response.status, payload?.errors ?? {})
  }
  return payload as T;
}
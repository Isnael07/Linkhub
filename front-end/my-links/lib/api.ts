export const INTERNAL_API = "/api";

export class ApiError<T = unknown> extends Error {
  public status: number;
  public data?: T;

  constructor(message: string, status: number, data?: T) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getBaseUrl() {
  // Prefer runtime-provided public API URL, fallback to internal proxy
  return (process.env.NEXT_PUBLIC_API_URL as string) || INTERNAL_API;
}

function getBackendUrl() {
  // Server-side base URL used for direct requests to the backend.
  // Must be absolute because fetch() on the server cannot resolve relative URLs.
  return (process.env.BACKEND_URL as string) || "http://localhost:8080";
}

// Backwards-compatible export for server modules that call the backend directly
export const BASE_URL = getBackendUrl();

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const base = getBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    // Try to parse error body, but don't throw if it's not JSON
    const data = await res.json().catch(() => null);
    let message = res.statusText || "Erro inesperado na requisição";

    if (data && typeof data === "object" && data !== null) {
      const body = data as Record<string, unknown>;
      if (typeof body.message === "string") {
        message = body.message;
      }
    }

    throw new ApiError(message, res.status, data);
  }
  
  return res;
}

export async function apiJson<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);
  // Parse JSON safely
  try {
    return (await res.json()) as T;
  } catch {
    // When there's no JSON body, return null as unknown
    return null as unknown as T;
  }
}

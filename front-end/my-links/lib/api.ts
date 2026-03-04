export const BASE_URL = "http://localhost:8080";
export const INTERNAL_API = "/api";

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const res = await fetch(`${INTERNAL_API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });
  return res;
}

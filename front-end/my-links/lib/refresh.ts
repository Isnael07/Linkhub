import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/api";

/** Expected shape returned by the backend `/refresh/{refreshToken}` endpoint. */
export interface RefreshResult {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export const ACCESS_TOKEN_MAX_AGE = 300;
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
};

/** Minimal shape of a cookie jar usable both in route handlers and middleware. */
interface CookieJar {
    set(name: string, value: string, options: Record<string, unknown>): void;
}

/** Stores (or rotates) the access and refresh token cookies from a refresh result. */
export function setTokenCookies(jar: CookieJar, tokens: RefreshResult): void {
    jar.set("accessToken", tokens.accessToken, {
        ...TOKEN_COOKIE_OPTIONS,
        maxAge: tokens.expiresIn ?? ACCESS_TOKEN_MAX_AGE,
    });
    jar.set("refreshToken", tokens.refreshToken, {
        ...TOKEN_COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
}

/**
 * Calls the backend `/refresh/{refreshToken}` endpoint.
 * Works in any environment (route handlers and middleware).
 * Returns null when the refresh token is invalid/expired.
 */
export async function callBackendRefresh(refreshToken: string): Promise<RefreshResult | null> {
    try {
        const res = await fetch(`${BASE_URL}/refresh/${encodeURIComponent(refreshToken)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) return null;

        return (await res.json()) as RefreshResult;
    } catch {
        return null;
    }
}

// Deduplicates concurrent refresh attempts using a single in-flight promise.
// The backend rotates the refresh token at most every 15 days, but deduping
// avoids hammering it (and transient 404s) when many requests expire together.
let refreshPromise: Promise<boolean> | null = null;

/**
 * Refreshes the access token using the stored refresh token cookie.
 * Updates both cookies on success. Returns false when there is no
 * refresh token or when the refresh fails.
 *
 * Only for route handlers (uses next/headers cookies()).
 */
export async function refreshTokens(): Promise<boolean> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!refreshToken) return false;

        const tokens = await callBackendRefresh(refreshToken);
        if (!tokens) return false;

        setTokenCookies(cookieStore, tokens);
        return true;
    })();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}
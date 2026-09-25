import { NextRequest, NextResponse } from "next/server";
import { verifyJwt, hasAdminRole } from "@/lib/auth";
import { callBackendRefresh, setTokenCookies, type RefreshResult } from "@/lib/refresh";

// Routes that require authentication
const PROTECTED_PATHS = ["/dashboard", "/profile", "/admin"];

// Routes only accessible when NOT authenticated
const AUTH_PAGES = ["/signin", "/signup"];

// HTTP methods that mutate data and require CSRF protection
const UNSAFE_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

// Allowed origins for CSRF verification (add production domain here)
const ALLOWED_ORIGINS = new Set([
    "http://localhost:3000",
]);

/** Landing page after a successful login, depending on the user's role. */
function homePath(isAdmin: boolean): string {
    return isAdmin ? "/admin/usuarios" : "/dashboard";
}

function matchesAnyPrefix(pathname: string, prefixes: string[]): boolean {
    return prefixes.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Blocks mutating /api requests that don't come from an allowed origin.
 * Returns a 403 response when the request must be rejected, or null when it can proceed.
 */
function verifyCsrf(req: NextRequest): NextResponse | null {
    // Only check unsafe (mutating) methods
    if (!UNSAFE_METHODS.has(req.method)) return null;

    const origin = req.headers.get("origin");

    // Requests without Origin header (e.g. server-to-server) are blocked
    if (!origin) {
        return NextResponse.json(
            { message: "Requisição bloqueada: Origin ausente" },
            { status: 403 }
        );
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
        return NextResponse.json(
            { message: "Requisição bloqueada: Origin não permitido" },
            { status: 403 }
        );
    }

    return null;
}

type Session = {
    isTokenValid: boolean;
    isAdmin: boolean;
    /** New tokens obtained from the refresh flow, when one was performed. */
    refreshedTokens: RefreshResult | null;
};

/**
 * Resolves the current session from the cookies, renewing the access token
 * when it is missing/expired and a refresh token is available.
 */
async function resolveSession(req: NextRequest): Promise<Session> {
    const accessToken = req.cookies.get("accessToken")?.value;
    const accessPayload = accessToken ? await verifyJwt(accessToken) : null;

    if (accessPayload) {
        return {
            isTokenValid: true,
            isAdmin: hasAdminRole(accessPayload),
            refreshedTokens: null,
        };
    }

    return renewSession(req.cookies.get("refreshToken")?.value);
}

/** Exchanges the refresh token for a new pair, returning an empty session on failure. */
async function renewSession(refreshToken: string | undefined): Promise<Session> {
    const tokens = refreshToken ? await callBackendRefresh(refreshToken) : null;

    if (!tokens) {
        return { isTokenValid: false, isAdmin: false, refreshedTokens: null };
    }

    const payload = await verifyJwt(tokens.accessToken);

    return {
        isTokenValid: Boolean(payload),
        isAdmin: hasAdminRole(payload),
        refreshedTokens: tokens,
    };
}

/** Returns the path the user should be sent to, or null when the request can continue. */
function decideRedirect(
    isProtected: boolean,
    isAuthPage: boolean,
    session: Session
): string | null {
    const { isTokenValid, isAdmin } = session;

    // Not authenticated or invalid token → redirect to signin
    if (isProtected && !isTokenValid) return "/signin";

    // Already authenticated → redirect away from auth pages
    if (isAuthPage && isTokenValid) return homePath(isAdmin);

    return null;
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // --- CSRF protection for API routes ---
    if (pathname.startsWith("/api/")) {
        return verifyCsrf(req) ?? NextResponse.next();
    }

    // --- Route protection for pages ---
    const session = await resolveSession(req);
    const redirectTo = decideRedirect(
        matchesAnyPrefix(pathname, PROTECTED_PATHS),
        matchesAnyPrefix(pathname, AUTH_PAGES),
        session
    );

    const res = redirectTo
        ? NextResponse.redirect(new URL(redirectTo, req.url))
        : NextResponse.next();

    if (session.refreshedTokens) {
        setTokenCookies(res.cookies, session.refreshedTokens);
    }

    return res;
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/admin/:path*",
        "/signin",
        "/signup",
        "/api/:path*",
    ],
};

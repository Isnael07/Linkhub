import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED_PATHS = ["/dashboard", "/profile"];

// Routes only accessible when NOT authenticated
const AUTH_PAGES = ["/signin", "/signup"];

// HTTP methods that mutate data and require CSRF protection
const UNSAFE_METHODS = ["POST", "PATCH", "PUT", "DELETE"];

// Allowed origins for CSRF verification (add production domain here)
const ALLOWED_ORIGINS = [
    "http://localhost:3000",
];

function verifyCsrf(req: NextRequest): NextResponse | null {
    // Only check unsafe (mutating) methods
    if (!UNSAFE_METHODS.includes(req.method)) return null;

    const origin = req.headers.get("origin");

    // Requests without Origin header (e.g. server-to-server) are blocked
    if (!origin) {
        return NextResponse.json(
            { message: "Requisição bloqueada: Origin ausente" },
            { status: 403 }
        );
    }

    if (!ALLOWED_ORIGINS.includes(origin)) {
        return NextResponse.json(
            { message: "Requisição bloqueada: Origin não permitido" },
            { status: 403 }
        );
    }

    return null;
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // --- CSRF protection for API routes ---
    if (pathname.startsWith("/api/")) {
        const csrfError = verifyCsrf(req);
        if (csrfError) return csrfError;
        return NextResponse.next();
    }

    // --- Route protection for pages ---
    const token = req.cookies.get("accessToken")?.value;

    const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
    const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

    // Not authenticated → redirect to signin
    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Already authenticated → redirect away from auth pages
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/signin",
        "/signup",
        "/api/:path*",
    ],
};

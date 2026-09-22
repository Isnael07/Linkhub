import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { refreshTokens } from "@/lib/refresh";

/** Expected shape of the JWT payload after verification. */
interface JwtPayload {
    sub: string;
    roles?: string[];
    iss?: string;
    iat?: number;
    exp?: number;
    aud?: string | string[];
}

/**
 * Returns the HMAC secret key used to verify JWTs.
 * Must match the same JWT_SECRET used by the Spring Boot backend.
 */
function getJwtSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not set");
    }

    return new TextEncoder().encode(secret);
}

/**
 * Extracts the accessToken from HTTPOnly cookies.
 */
export async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();

    return cookieStore.get("accessToken")?.value;
}

/**
 * Verifies a JWT using HS256, issuer and audience.
 *
 * The issuer and audience are mandatory.
 * There is intentionally no fallback verification without them.
 */
export async function verifyJwt(
    token: string
): Promise<JwtPayload | null> {
    const secret = getJwtSecret();

    const issuer = process.env.JWT_ISSUER ?? "links-hub-v0";
    const audience = process.env.JWT_AUDIENCE ?? "links-hub-v0";

    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
            issuer,
            audience,
        });

        if (!payload.sub) {
            return null;
        }

        return payload as JwtPayload;
    } catch {
        return null;
    }
}

/**
 * Returns the authenticated user's ID (JWT `sub` claim) or null.
 * Combines getToken + signature verification in a single call.
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
    const token = await getToken();
    if (!token) return null;

    const payload = await verifyJwt(token);
    if (!payload || typeof payload.sub !== "string") return null;

    return payload.sub;
}

/**
 * Returns a valid access token, refreshing it automatically when the
 * stored one is missing or expired and a refresh token is available.
 * Returns null when there is no valid token and refresh fails.
 */
export async function getValidAccessToken(): Promise<string | null> {
    const token = await getToken();
    if (token && (await verifyJwt(token))) return token;

    const refreshed = await refreshTokens();
    if (!refreshed) return null;

    return (await getToken()) ?? null;
}

type AuthResult =
    | { token: string; userId: string; error?: never }
    | { token?: never; userId?: never; error: NextResponse };

/**
 * Guard that verifies the user is authenticated.
 * Returns `{ token, userId }` on success, or `{ error: NextResponse }` on failure.
 */
export async function requireAuth(): Promise<AuthResult> {
    const token = await getValidAccessToken();
    if (!token) {
        return { error: NextResponse.json({ message: "Não autenticado" }, { status: 401 }) };
    }

    const payload = await verifyJwt(token);
    if (!payload || typeof payload.sub !== "string") {
        return { error: NextResponse.json({ message: "Token inválido" }, { status: 401 }) };
    }

    return { token, userId: payload.sub };
}

/**
 * Guard that verifies the user is authenticated AND is the owner of the resource.
 * Returns `{ token, userId }` on success, or `{ error: NextResponse }` on failure (401 or 403).
 */
export async function requireOwnership(targetId: string): Promise<AuthResult> {
    const auth = await requireAuth();
    if (auth.error) return auth;

    if (auth.userId !== targetId) {
        return { error: NextResponse.json({ message: "Acesso negado" }, { status: 403 }) };
    }

    return auth;
}

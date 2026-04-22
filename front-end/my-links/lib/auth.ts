import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

/** Expected shape of the JWT payload after verification. */
interface JwtPayload {
    sub: string;
    roles?: string[];
    iss?: string;
    iat?: number;
    exp?: number;
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
 * Verifies a JWT signature (HS256) and returns the payload.
 * Returns null if the token is invalid, expired, or tampered with.
 */
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
    const secret = getJwtSecret();
    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
            issuer: "links-hub-v0",
            audience: "links-hub-api",
        });
        if (!payload.sub) return null;
        return payload as unknown as JwtPayload;
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

type AuthResult =
    | { token: string; userId: string; error?: never }
    | { token?: never; userId?: never; error: NextResponse };

/**
 * Guard that verifies the user is authenticated.
 * Returns `{ token, userId }` on success, or `{ error: NextResponse }` on failure.
 */
export async function requireAuth(): Promise<AuthResult> {
    const token = await getToken();
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

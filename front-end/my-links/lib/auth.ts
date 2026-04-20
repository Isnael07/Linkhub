import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Extracts the accessToken from HTTPOnly cookies.
 */
export async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
}

/**
 * Decodes a JWT payload WITHOUT verifying the signature.
 * Used only to extract claims like `sub` for ownership checks.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const base64 = token.split(".")[1];
        const json = Buffer.from(base64, "base64").toString("utf-8");
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/**
 * Returns the authenticated user's ID (JWT `sub` claim) or null.
 * Combines getToken + decode in a single call.
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
    const token = await getToken();
    if (!token) return null;

    const payload = decodeJwtPayload(token);
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
    const userId = await getAuthenticatedUserId();

    if (!token || !userId) {
        return { error: NextResponse.json({ message: "Não autenticado" }, { status: 401 }) };
    }

    return { token, userId };
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

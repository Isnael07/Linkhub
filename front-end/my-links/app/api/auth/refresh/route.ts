import { NextResponse } from "next/server";
import { refreshTokens } from "@/lib/refresh";

// POST /api/auth/refresh — generate a new access token from the refresh token cookie
export async function POST() {
    const refreshed = await refreshTokens();

    if (!refreshed) {
        return NextResponse.json(
            { message: "Refresh token inválido ou expirado" },
            { status: 401 }
        );
    }

    return NextResponse.json({ success: true });
}
import { NextResponse } from "next/server";
import { BASE_URL } from "@/lib/api";
import { getToken, decodeJwtPayload } from "@/lib/auth";

export async function GET() {
    const accessToken = await getToken();

    if (!accessToken) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = decodeJwtPayload(accessToken);
    if (!payload || !payload.sub) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Fetch user data from backend
    try {
        const backendRes = await fetch(`${BASE_URL}/user/${payload.sub}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!backendRes.ok) {
            return NextResponse.json(
                { authenticated: true, userId: payload.sub, username: null, email: null }
            );
        }

        const user = await backendRes.json();
        return NextResponse.json({
            authenticated: true,
            userId: user.id,
            username: user.username,
            email: user.email,
        });
    } catch {
        return NextResponse.json(
            { authenticated: true, userId: payload.sub, username: null, email: null }
        );
    }
}

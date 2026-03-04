import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/api";

function decodeJwtPayload(token: string) {
    try {
        const base64 = token.split(".")[1];
        const json = Buffer.from(base64, "base64").toString("utf-8");
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

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

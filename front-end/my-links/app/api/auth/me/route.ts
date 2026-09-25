import { NextResponse } from "next/server";
import { BASE_URL } from "@/lib/api";
import { getValidAccessToken, verifyJwt } from "@/lib/auth";

export async function GET() {
    const accessToken = await getValidAccessToken();

    if (!accessToken) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifyJwt(accessToken);
    if (!payload?.sub) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const roles: string[] = Array.isArray(payload.roles) ? (payload.roles as string[]) : [];
    const role = roles.includes("ROLE_ADMIN") ? "ADMIN" : "USER";

    // Fetch user data from backend
    try {
        const backendRes = await fetch(`${BASE_URL}/user/${payload.sub}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!backendRes.ok) {
            return NextResponse.json(
                { authenticated: true, userId: payload.sub, username: null, email: null, role }
            );
        }

        const user = await backendRes.json();
        return NextResponse.json({
            authenticated: true,
            userId: user.id,
            username: user.username,
            email: user.email,
            role,
        });
    } catch {
        return NextResponse.json(
            { authenticated: true, userId: payload.sub, username: null, email: null, role }
        );
    }
}

import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/api";
import { requireAuth, requireOwnership } from "@/lib/auth";

// GET /api/links?userId=xxx — fetch links by user
export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ message: "userId obrigatório" }, { status: 400 });
    }

    const auth = await requireOwnership(userId);
    if (auth.error) return auth.error;

    const backendRes = await fetch(`${BASE_URL}/links/users/${userId}/links`, {
        headers: { Authorization: `Bearer ${auth.token}` },
    });

    if (!backendRes.ok) {
        return NextResponse.json(
            { message: "Erro ao buscar links" },
            { status: backendRes.status }
        );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
}

// POST /api/links — create link
export async function POST(req: NextRequest) {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.json();

    // IDOR protection: only allow creating links for own user
    if (body.userId && auth.userId !== body.userId) {
        return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
    }

    const backendRes = await fetch(`${BASE_URL}/links`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
        let message = "Erro ao criar link";
        try {
            const err = await backendRes.json();
            if (err?.message) message = err.message;
        } catch { }
        return NextResponse.json({ message }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
}

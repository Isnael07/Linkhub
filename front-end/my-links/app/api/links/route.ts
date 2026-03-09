import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/api";

async function getToken() {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
}

// GET /api/links?userId=xxx — fetch links by user
export async function GET(req: NextRequest) {
    const token = await getToken();
    if (!token) {
        return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ message: "userId obrigatório" }, { status: 400 });
    }

    const backendRes = await fetch(`${BASE_URL}/links/users/${userId}/links`, {
        headers: { Authorization: `Bearer ${token}` },
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
    const token = await getToken();
    if (!token) {
        return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();

    const backendRes = await fetch(`${BASE_URL}/links`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

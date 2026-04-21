import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireOwnership } from "@/lib/auth";
import { proxyBackendRequest } from "@/lib/serverProxy";

// GET /api/links?userId=xxx — fetch links by user
export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ message: "userId obrigatório" }, { status: 400 });
    }

    const auth = await requireOwnership(userId);
    if (auth.error) return auth.error;

    return proxyBackendRequest(`/links/users/${userId}/links`, {
        token: auth.token,
        defaultErrorMessage: "Erro ao buscar links"
    });
}

// POST /api/links — create link
export async function POST(req: NextRequest) {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.text();

    // IDOR protection: only allow creating links for own user
    const parsedBody = JSON.parse(body);
    if (parsedBody.userId && auth.userId !== parsedBody.userId) {
        return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
    }

    return proxyBackendRequest("/links", {
        method: "POST",
        body,
        token: auth.token,
        defaultErrorMessage: "Erro ao criar link"
    });
}

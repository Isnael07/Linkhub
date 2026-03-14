import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/api";

// GET /api/links/public/[username] — fetch public links (no auth required)
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    const backendRes = await fetch(`${BASE_URL}/links/public/${username}`, {
        cache: "no-store",
    });

    if (!backendRes.ok) {
        const status = backendRes.status;
        if (status === 404) {
            return NextResponse.json(
                { message: "Usuário não encontrado" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "Erro ao buscar links" },
            { status }
        );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
}

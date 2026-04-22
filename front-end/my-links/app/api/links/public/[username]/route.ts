import { NextRequest, NextResponse } from "next/server";
import { proxyBackendRequest } from "@/lib/serverProxy";

// GET /api/links/public/[username] — fetch public links (no auth required)
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    return proxyBackendRequest(`/links/public/${username}`, {
        skipAuth: true,
        cache: "no-store",
        defaultErrorMessage: "Erro ao buscar links",
        customErrorMapper: (status) => {
            if (status === 404) {
                return NextResponse.json(
                    { message: "Usuário não encontrado" },
                    { status: 404 }
                );
            }
            return null;
        }
    });
}

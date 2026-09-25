import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { proxyBackendRequest } from "@/lib/serverProxy";

// GET /api/admin/users — list all users with their links (admin only)
export async function GET(req: NextRequest) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "0";
    const size = searchParams.get("size") ?? "100";

    return proxyBackendRequest(`/user?page=${page}&size=${size}`, {
        token: auth.token,
        defaultErrorMessage: "Erro ao buscar usuários",
    });
}
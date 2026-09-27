import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { requireOwnership } from "@/lib/auth";
import { proxyBackendRequest } from "@/lib/serverProxy";

// GET /api/user/[id] — fetch user profile
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await requireOwnership(id);
    if (auth.error) return auth.error;

    return proxyBackendRequest(`/user/${id}`, {
        token: auth.token,
        defaultErrorMessage: "Erro ao buscar perfil"
    });
}

// PATCH /api/user/[id] — update user profile
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await requireOwnership(id);
    if (auth.error) return auth.error;

    const body = await req.text();

    return proxyBackendRequest(`/user/${id}`, {
        method: "PATCH",
        body,
        token: auth.token,
        defaultErrorMessage: "Erro ao atualizar perfil"
    });
}

// DELETE /api/user/[id] — delete user account
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await requireOwnership(id);
    if (auth.error) return auth.error;

    const response = await proxyBackendRequest(`/user/${id}`, {
        method: "DELETE",
        token: auth.token,
        defaultErrorMessage: "Erro ao deletar conta"
    });

    if (response.ok) {
        const cookieStore = await cookies();
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
    }

    return response;
}

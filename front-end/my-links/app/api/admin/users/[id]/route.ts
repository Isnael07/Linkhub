import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { proxyBackendRequest } from "@/lib/serverProxy";

// PATCH /api/admin/users/[id] — update any user (admin only)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await req.text();

    return proxyBackendRequest(`/user/${id}`, {
        method: "PATCH",
        body,
        token: auth.token,
        defaultErrorMessage: "Erro ao atualizar usuário"
    });
}

// DELETE /api/admin/users/[id] — delete any user (admin only)
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    if (auth.userId === id) {
        return Response.json(
            { message: "Você não pode deletar a sua própria conta pelo painel admin" },
            { status: 400 }
        );
    }

    return proxyBackendRequest(`/user/${id}`, {
        method: "DELETE",
        token: auth.token,
        defaultErrorMessage: "Erro ao deletar usuário"
    });
}

import { NextRequest } from "next/server";
import { proxyBackendRequest } from "@/lib/serverProxy";

// PATCH /api/links/[id] — update link
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.text();

    return proxyBackendRequest(`/links/${id}`, {
        method: "PATCH",
        body,
        requireAuth: true,
        defaultErrorMessage: "Erro ao atualizar link"
    });
}

// DELETE /api/links/[id] — delete link
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    return proxyBackendRequest(`/links/${id}`, {
        method: "DELETE",
        requireAuth: true,
        defaultErrorMessage: "Erro ao deletar link"
    });
}

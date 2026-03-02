import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/api";

async function getToken() {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
}

// GET /api/user/[id] — fetch user profile
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = await getToken();
    if (!token) {
        return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const backendRes = await fetch(`${BASE_URL}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!backendRes.ok) {
        return NextResponse.json(
            { message: "Erro ao buscar perfil" },
            { status: backendRes.status }
        );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
}

// PATCH /api/user/[id] — update user profile
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = await getToken();
    if (!token) {
        return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const backendRes = await fetch(`${BASE_URL}/user/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
        let message = "Erro ao atualizar perfil";
        try {
            const err = await backendRes.json();
            if (err?.message) message = err.message;
        } catch { }
        return NextResponse.json({ message }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
}

// DELETE /api/user/[id] — delete user account
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = await getToken();
    if (!token) {
        return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const backendRes = await fetch(`${BASE_URL}/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!backendRes.ok) {
        return NextResponse.json(
            { message: "Erro ao deletar conta" },
            { status: backendRes.status }
        );
    }

    // Also clear auth cookies
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json({ success: true });
}

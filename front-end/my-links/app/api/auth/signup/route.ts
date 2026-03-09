import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/api";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const backendRes = await fetch(`${BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!backendRes.ok) {
            let message = "Erro ao criar conta";
            try {
                const errBody = await backendRes.json();
                if (errBody?.message) message = errBody.message;
            } catch {
                // ignore parse errors
            }
            return NextResponse.json({ message }, { status: backendRes.status });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { message: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}

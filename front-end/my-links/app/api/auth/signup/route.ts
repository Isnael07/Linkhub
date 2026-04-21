import { NextRequest } from "next/server";
import { proxyBackendRequest } from "@/lib/serverProxy";

export async function POST(req: NextRequest) {
    const body = await req.text();
    return proxyBackendRequest("/signup", {
        method: "POST",
        body,
        skipAuth: true,
        defaultErrorMessage: "Erro ao criar conta"
    });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/api";

export type ProxyOptions = RequestInit & {
    token?: string; // Optional token to override cookie
    skipAuth?: boolean;
    requireAuth?: boolean; // Return 401 early if no token is found
    defaultErrorMessage?: string;
    customErrorMapper?: (status: number, errBody: any) => NextResponse | null;
};

async function getAuthToken(options: ProxyOptions): Promise<string | undefined> {
    if (options.token) return options.token;
    if (options.skipAuth) return undefined;
    
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
}

function prepareHeaders(fetchOptions: RequestInit, token?: string): Headers {
    const headers = new Headers(fetchOptions.headers);
    
    const method = fetchOptions.method;
    const needsContentType = method && method !== "GET" && method !== "DELETE";
    
    if (needsContentType && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
}

async function handleErrorResponse(
    backendRes: Response,
    defaultErrorMessage: string,
    customErrorMapper?: (status: number, errBody: any) => NextResponse | null
): Promise<NextResponse> {
    let errBody: any = null;
    try {
        errBody = await backendRes.json();
    } catch { 
        // ignore parse errors
    }

    if (customErrorMapper) {
        const mappedResponse = customErrorMapper(backendRes.status, errBody);
        if (mappedResponse) return mappedResponse;
    }

    const message = errBody?.message || defaultErrorMessage;
    return NextResponse.json({ message }, { status: backendRes.status });
}

async function handleSuccessResponse(backendRes: Response): Promise<NextResponse> {
    if (backendRes.status === 204) {
        return new NextResponse(null, { status: 204 });
    }

    const data = await backendRes.json().catch(() => null);
    return NextResponse.json(data ?? { success: true }, { status: backendRes.status });
}

export async function proxyBackendRequest(
    path: string,
    options: ProxyOptions = {}
) {
    const { 
        token: _providedToken, 
        skipAuth: _skipAuth, 
        requireAuth,
        defaultErrorMessage = "Erro no servidor", 
        customErrorMapper,
        ...fetchOptions 
    } = options;
    
    const token = await getAuthToken(options);
    
    if (requireAuth && !token && !options.skipAuth) {
        return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const headers = prepareHeaders(fetchOptions, token);
    const url = `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    if (fetchOptions.signal) {
        if (fetchOptions.signal.aborted) {
            controller.abort();
        } else {
            fetchOptions.signal.addEventListener("abort", () => controller.abort(), { once: true });
        }
    }

    try {
        const backendRes = await fetch(url, { ...fetchOptions, headers, signal: controller.signal });
        clearTimeout(timeoutId);

        if (!backendRes.ok) {
            return handleErrorResponse(backendRes, defaultErrorMessage, customErrorMapper);
        }

        return handleSuccessResponse(backendRes);
    } catch (error) {
        clearTimeout(timeoutId);
        console.error("[proxyBackendRequest] Erro de conexão com o backend:", error);
        
        const isTimeout = (error as Error).name === "AbortError" && !fetchOptions.signal?.aborted;
        return NextResponse.json(
            { message: isTimeout ? "Tempo limite de requisição excedido" : "Erro de conexão com o backend" },
            { status: isTimeout ? 504 : 503 }
        );
    }
}

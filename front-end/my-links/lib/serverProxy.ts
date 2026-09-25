import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/api";
import { getToken, verifyJwt } from "@/lib/auth";
import { refreshTokens } from "@/lib/refresh";

export type BackendErrorBody = {
    message?: string;
} & Record<string, unknown>;

export type ProxyOptions = RequestInit & {
    token?: string; // Optional token to override cookie
    skipAuth?: boolean;
    requireAuth?: boolean; // Return 401 early if no token is found
    defaultErrorMessage?: string;
    customErrorMapper?: (status: number, errBody: BackendErrorBody | null) => NextResponse | null;
};

async function getAuthToken(token?: string, skipAuth?: boolean): Promise<string | undefined> {
    if (token) return token;
    if (skipAuth) return undefined;

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
    customErrorMapper?: (status: number, errBody: BackendErrorBody | null) => NextResponse | null
): Promise<NextResponse> {
    const errBody: BackendErrorBody | null = await backendRes.json().catch(() => null);

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
        token,
        skipAuth,
        requireAuth,
        defaultErrorMessage = "Erro no servidor",
        customErrorMapper,
        ...fetchOptions
    } = options;

    let authToken = await getAuthToken(token, skipAuth);

    // Token present but expired/invalid → try to refresh before proxying
    if (authToken && !(await verifyJwt(authToken))) {
        const refreshed = await refreshTokens();
        authToken = refreshed ? (await getToken()) : undefined;
    }

    if (requireAuth && !authToken && !skipAuth) {
        return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const headers = prepareHeaders(fetchOptions, authToken);
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

"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiFetch, apiJson } from "@/lib/api";

type User = {
    userId: string;
    username: string | null;
    email: string | null;
    role?: "ADMIN" | "USER" | null;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const refreshUser = useCallback(async () => {
            try {
                const data = await apiJson<{ authenticated?: boolean; userId?: string; username?: string | null; email?: string | null; role?: "ADMIN" | "USER" | null }>("/auth/me");
                if (data?.authenticated) {
                    const authenticatedUser: User = {
                        userId: data.userId as string,
                        username: data.username ?? null,
                        email: data.email ?? null,
                        role: data.role ?? null,
                    };
                    setUser(authenticatedUser);
                    return authenticatedUser;
                }
                setUser(null);
                return null;
            } catch {
                setUser(null);
                return null;
            }
    }, []);

    useEffect(() => {
        refreshUser().finally(() => setIsLoading(false));
    }, [refreshUser]);

    const login = useCallback(async (email: string, password: string) => {
        await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        const authenticatedUser = await refreshUser();
        if (!authenticatedUser) {
            throw new Error("Falha ao autenticar");
        }

        router.push(
            authenticatedUser.role === "ADMIN" ? "/admin/usuarios" : "/dashboard"
        );
    }, [refreshUser, router]);

    const logout = useCallback(async () => {
        await apiFetch("/auth/logout", {
            method: "POST",
        });
        setUser(null);
        router.push("/");
    }, [router]);

    const contextValue = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            isAdmin: user?.role === "ADMIN",
            isLoading,
            login,
            logout,
            refreshUser,
        }),
        [user, isLoading, login, logout, refreshUser]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
    }
    return ctx;
}

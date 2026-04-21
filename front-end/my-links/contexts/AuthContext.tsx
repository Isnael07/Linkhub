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
import { apiFetch } from "@/lib/api";

type User = {
    userId: string;
    username: string | null;
    email: string | null;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const refreshUser = useCallback(async () => {
        try {
            const res = await apiFetch("/auth/me");
            const data = await res.json();
            if (data.authenticated) {
                setUser({
                    userId: data.userId,
                    username: data.username,
                    email: data.email,
                });
                return;
            }
            setUser(null);
        } catch {
            setUser(null);
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

        await refreshUser();
        router.push("/dashboard");
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

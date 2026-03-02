"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Profile = {
    id: string;
    username: string;
    email: string;
};

export function useProfile() {
    const { user, logout, refreshUser } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/user/${user.userId}`, {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Erro ao buscar perfil");

            const data = await res.json();
            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro inesperado");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const updateProfile = async (data: { username?: string; password?: string }) => {
        if (!user) throw new Error("Não autenticado");

        const res = await fetch(`/api/user/${user.userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            throw new Error(err?.message || "Erro ao atualizar perfil");
        }

        const updated = await res.json();
        setProfile(updated);
        await refreshUser();
        return updated;
    };

    const deleteAccount = async () => {
        if (!user) throw new Error("Não autenticado");

        const res = await fetch(`/api/user/${user.userId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            throw new Error(err?.message || "Erro ao deletar conta");
        }

        await logout();
    };

    return {
        profile,
        isLoading,
        error,
        fetchProfile,
        updateProfile,
        deleteAccount,
    };
}

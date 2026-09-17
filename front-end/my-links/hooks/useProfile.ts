"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch, apiJson } from "@/lib/api";

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
            const data = await apiJson<Profile>(`/user/${user.userId}`);
            setProfile(data || null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro inesperado");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const updateProfile = async (data: { username?: string; password?: string }) => {
        if (!user) throw new Error("Não autenticado");

        const updated = await apiJson<Profile>(`/user/${user.userId}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        setProfile(updated);
        await refreshUser();
        return updated;
    };

    const deleteAccount = async () => {
        if (!user) throw new Error("Não autenticado");

        await apiFetch(`/user/${user.userId}`, {
            method: "DELETE",
        });

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

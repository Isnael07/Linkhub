"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch, apiJson } from "@/lib/api";

export type Link = {
    id: string;
    nameUrl: string;
    url: string;
};

export function useLinks() {
    const { user } = useAuth();
    const [links, setLinks] = useState<Link[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLinks = useCallback(async () => {
        if (!user) return;
        if (!user.username) {
            setIsLoading(false);
            setError("Nome de usuário ausente para buscar links.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await apiJson<Link[]>(`/links/public/${user.username}`);
            setLinks(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro inesperado");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const updateLink = async (id: string, data: { nameUrl?: string; url?: string }) => {
        const updated = await apiJson<Link>(`/links/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        setLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));
        return updated;
    };

    const deleteLink = async (id: string) => {
        await apiFetch(`/links/${id}`, {
            method: "DELETE",
        });

        setLinks((prev) => prev.filter((l) => l.id !== id));
    };

    return {
        links,
        isLoading,
        error,
        fetchLinks,
        updateLink,
        deleteLink,
    };
}

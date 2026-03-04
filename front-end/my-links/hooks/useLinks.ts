"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

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
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/links?userId=${user.userId}`, {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Erro ao buscar links");

            const data = await res.json();
            setLinks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro inesperado");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const updateLink = async (id: string, data: { nameUrl?: string; url?: string }) => {
        const res = await fetch(`/api/links/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            throw new Error(err?.message || "Erro ao atualizar link");
        }

        const updated = await res.json();
        setLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));
        return updated;
    };

    const deleteLink = async (id: string) => {
        const res = await fetch(`/api/links/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) {
            const err = await res.json().catch(() => null);
            throw new Error(err?.message || "Erro ao deletar link");
        }

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

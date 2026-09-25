"use client";

import { useState, useCallback } from "react";
import { apiFetch, apiJson, ApiError } from "@/lib/api";

export type AdminLink = {
    id: string;
    nameUrl: string;
    url: string;
};

export type AdminUser = {
    id: string;
    username: string;
    email: string;
    links: AdminLink[] | null;
};

type UsersPageResponse = {
    content?: AdminUser[];
    page?: { size: number; totalElements: number; totalPages: number; number: number };
    totalElements?: number;
    totalPages?: number;
    number?: number;
};

export function useAdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setAccessDenied(false);
        try {
            const data = await apiJson<UsersPageResponse>("/admin/users?page=0&size=100");
            const content = Array.isArray(data?.content) ? data.content : [];
            setUsers(content);
            setTotalUsers(
                data?.page?.totalElements ?? data?.totalElements ?? content.length
            );
        } catch (err) {
            if (err instanceof ApiError && err.status === 403) {
                setAccessDenied(true);
            } else {
                setError(err instanceof Error ? err.message : "Erro ao carregar usuários");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateUser = useCallback(
        async (id: string, data: { username?: string; password?: string }) => {
            const updated = await apiJson<AdminUser>(`/admin/users/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === id
                        ? { ...u, ...updated, links: updated?.links ?? u.links }
                        : u
                )
            );

            return updated;
        },
        []
    );

    const deleteUser = useCallback(async (id: string) => {
        await apiFetch(`/admin/users/${id}`, { method: "DELETE" });

        setUsers((prev) => prev.filter((u) => u.id !== id));
        setTotalUsers((current) => Math.max(0, current - 1));
    }, []);

    const updateLink = useCallback(
        async (userId: string, linkId: string, data: { nameUrl?: string; url?: string }) => {
            const updated = await apiJson<AdminLink>(`/links/${linkId}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId && u.links
                        ? {
                            ...u,
                            links: u.links.map((l) => (l.id === linkId ? { ...l, ...updated } : l)),
                        }
                        : u
                )
            );

            return updated;
        },
        []
    );

    const deleteLink = useCallback(async (userId: string, linkId: string) => {
        await apiFetch(`/links/${linkId}`, { method: "DELETE" });

        setUsers((prev) =>
            prev.map((u) =>
                u.id === userId && u.links
                    ? { ...u, links: u.links.filter((l) => l.id !== linkId) }
                    : u
            )
        );
    }, []);

    return {
        users,
        totalUsers,
        isLoading,
        accessDenied,
        error,
        fetchUsers,
        updateUser,
        deleteUser,
        updateLink,
        deleteLink,
    };
}

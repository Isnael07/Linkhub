"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminUsers, type AdminLink, type AdminUser } from "@/hooks/useAdminUsers";
import { Navbar } from "@/components/Navbar";
import { LinkCard } from "@/components/LinkCard";
import { EditLinkModal } from "@/components/EditLinkModal";
import { DeleteConfirmModal } from "@/components/dashboard";
import { EditUserModal } from "@/components/admin/EditUserModal";
import {
    Loader2,
    Users,
    UserCircle,
    Mail,
    Link2,
    Pencil,
    Shield,
    ShieldAlert,
    Trash2,
} from "lucide-react";

type DeleteLinkTarget = {
    userId: string;
    link: AdminLink;
};

export default function AdminPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const {
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
    } = useAdminUsers();

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [deleteUserConfirm, setDeleteUserConfirm] = useState<AdminUser | null>(null);
    const [editingLink, setEditingLink] = useState<DeleteLinkTarget | null>(null);
    const [deleteLinkConfirm, setDeleteLinkConfirm] = useState<DeleteLinkTarget | null>(null);
    const [actionMessage, setActionMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const selectedUser = useMemo(
        () => users.find((u) => u.id === selectedUserId) ?? null,
        [users, selectedUserId]
    );

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/signin");
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUsers();
        }
    }, [isAuthenticated, fetchUsers]);

    useEffect(() => {
        if (!actionMessage) return;
        const timeoutId = setTimeout(() => setActionMessage(null), 4000);
        return () => clearTimeout(timeoutId);
    }, [actionMessage]);

    const handleUpdateUser = async (
        id: string,
        data: { username?: string; password?: string }
    ) => {
        await updateUser(id, data);
        setActionMessage({ type: "success", text: "Usuário atualizado com sucesso!" });
    };

    const handleDeleteUser = async () => {
        if (!deleteUserConfirm) return;

        try {
            await deleteUser(deleteUserConfirm.id);
            if (selectedUserId === deleteUserConfirm.id) {
                setSelectedUserId(null);
            }
            setActionMessage({
                type: "success",
                text: `Usuário ${deleteUserConfirm.username} removido.`,
            });
        } catch (err) {
            setActionMessage({
                type: "error",
                text: err instanceof Error ? err.message : "Erro ao deletar usuário",
            });
        } finally {
            setDeleteUserConfirm(null);
        }
    };

    const handleUpdateLink = async (
        linkId: string,
        data: { nameUrl: string; url: string }
    ) => {
        if (!editingLink) return;

        await updateLink(editingLink.userId, linkId, data);
        setActionMessage({ type: "success", text: "Link atualizado com sucesso!" });
    };

    const handleDeleteLink = async () => {
        if (!deleteLinkConfirm) return;

        try {
            await deleteLink(deleteLinkConfirm.userId, deleteLinkConfirm.link.id);
            setActionMessage({ type: "success", text: "Link removido com sucesso!" });
        } catch (err) {
            setActionMessage({
                type: "error",
                text: err instanceof Error ? err.message : "Erro ao deletar link",
            });
        } finally {
            setDeleteLinkConfirm(null);
        }
    };

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <p className="text-sm text-zinc-400">
                    Usuário não autenticado. Redirecionando para login...
                </p>
            </div>
        );
    }

    if (accessDenied) {
        return (
            <div className="min-h-screen bg-zinc-950">
                <Navbar />
                <main className="mx-auto flex max-w-md flex-col items-center px-6 pt-32 pb-16 text-center">
                    <div className="mb-4 rounded-2xl bg-red-500/10 p-4">
                        <ShieldAlert className="h-10 w-10 text-red-400" />
                    </div>
                    <h1 className="text-lg font-bold text-white">Acesso negado</h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        Apenas administradores podem acessar esta página.
                    </p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <Navbar />

            <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
                <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600">
                        <Shield className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Usuários</h1>
                        <p className="mt-1 flex items-center gap-1.5 text-zinc-400">
                            <Users className="h-4 w-4" />
                            {totalUsers} usuário{totalUsers === 1 ? "" : "s"} cadastrado
                            {totalUsers === 1 ? "" : "s"}
                        </p>
                    </div>
                </div>

                {actionMessage && (
                    <div
                        className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                            actionMessage.type === "success"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                : "border-red-500/30 bg-red-500/10 text-red-300"
                        }`}
                    >
                        {actionMessage.text}
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                    </div>
                )}

                {!isLoading && error && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
                        <div className="mb-4 rounded-2xl bg-red-500/10 p-4">
                            <Users className="h-10 w-10 text-red-400" />
                        </div>
                        <p className="text-sm text-zinc-400">{error}</p>
                    </div>
                )}

                {!isLoading && !error && users.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
                        <div className="mb-4 rounded-2xl bg-violet-500/10 p-4">
                            <Users className="h-10 w-10 text-violet-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            Nenhum usuário cadastrado
                        </h3>
                    </div>
                )}

                {!isLoading && !error && users.length > 0 && (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        {/* User list */}
                        <div className="flex flex-col gap-2">
                            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                                Usuários
                            </h2>
                            {users.map((u, index) => {
                                const isSelf = u.id === user?.userId;

                                return (
                                    <div
                                        key={u.id}
                                        className={`glass flex items-center gap-2 rounded-2xl p-4 pr-3 transition-all animate-slide-up ${
                                            selectedUserId === u.id
                                                ? "border-violet-500/40 bg-violet-500/10"
                                                : "hover:border-violet-500/20 hover:bg-white/5"
                                        }`}
                                        style={{ animationDelay: `${index * 0.04}s` }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedUserId(
                                                    selectedUserId === u.id ? null : u.id
                                                )
                                            }
                                            className="flex min-w-0 flex-1 items-center gap-4 text-left"
                                        >
                                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600">
                                                <UserCircle className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-white">
                                                    {u.username || "Sem username"}
                                                </p>
                                                <p className="flex items-center gap-1.5 truncate text-sm text-zinc-400">
                                                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                                                    {u.email || "Sem email"}
                                                </p>
                                            </div>
                                            <span className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300">
                                                <Link2 className="h-3.5 w-3.5" />
                                                {u.links?.length ?? 0}
                                            </span>
                                        </button>

                                        <div className="flex flex-shrink-0 items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setEditingUser(u)}
                                                title="Editar usuário"
                                                aria-label={`Editar ${u.username}`}
                                                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-cyan-400"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteUserConfirm(u)}
                                                disabled={isSelf}
                                                title={
                                                    isSelf
                                                        ? "Você não pode deletar a sua própria conta"
                                                        : "Deletar usuário"
                                                }
                                                aria-label={`Deletar ${u.username}`}
                                                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Selected user links */}
                        <div>
                            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                                Links do usuário
                            </h2>
                            {!selectedUser && (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
                                    <div className="mb-4 rounded-2xl bg-violet-500/10 p-4">
                                        <Link2 className="h-10 w-10 text-violet-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Selecione um usuário
                                    </h3>
                                    <p className="mt-1 text-sm text-zinc-400">
                                        Clique em um usuário ao lado para ver seus links
                                    </p>
                                </div>
                            )}

                            {selectedUser && (
                                <div className="glass rounded-2xl p-6 animate-slide-up">
                                    <div className="mb-5 flex items-center gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600">
                                            <UserCircle className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-lg font-bold text-white">
                                                @{selectedUser.username}
                                            </h3>
                                            <p className="flex items-center gap-1.5 truncate text-sm text-zinc-400">
                                                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                                                {selectedUser.email}
                                            </p>
                                        </div>
                                        <div className="flex flex-shrink-0 items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setEditingUser(selectedUser)}
                                                title="Editar usuário"
                                                aria-label={`Editar ${selectedUser.username}`}
                                                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-cyan-400"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteUserConfirm(selectedUser)}
                                                disabled={selectedUser.id === user?.userId}
                                                title={
                                                    selectedUser.id === user?.userId
                                                        ? "Você não pode deletar a sua própria conta"
                                                        : "Deletar usuário"
                                                }
                                                aria-label={`Deletar ${selectedUser.username}`}
                                                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {!selectedUser.links?.length && (
                                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-12 text-center">
                                            <div className="mb-3 rounded-xl bg-violet-500/10 p-3">
                                                <Link2 className="h-6 w-6 text-violet-400" />
                                            </div>
                                            <p className="text-sm text-zinc-400">
                                                Este usuário não possui links cadastrados.
                                            </p>
                                        </div>
                                    )}

                                    {selectedUser.links?.length ? (
                                        <div className="flex flex-col gap-3">
                                            {selectedUser.links.map((link) => (
                                                <LinkCard
                                                    key={link.id}
                                                    id={link.id}
                                                    nameUrl={link.nameUrl}
                                                    url={link.url}
                                                    onEdit={() =>
                                                        setEditingLink({
                                                            userId: selectedUser.id,
                                                            link,
                                                        })
                                                    }
                                                    onDelete={() =>
                                                        setDeleteLinkConfirm({
                                                            userId: selectedUser.id,
                                                            link,
                                                        })
                                                    }
                                                />
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {editingUser && (
                <EditUserModal
                    userId={editingUser.id}
                    initialUsername={editingUser.username ?? ""}
                    email={editingUser.email ?? ""}
                    onSave={handleUpdateUser}
                    onClose={() => setEditingUser(null)}
                />
            )}

            {editingLink && (
                <EditLinkModal
                    key={editingLink.link.id}
                    linkId={editingLink.link.id}
                    initialNameUrl={editingLink.link.nameUrl}
                    initialUrl={editingLink.link.url}
                    onSave={handleUpdateLink}
                    onClose={() => setEditingLink(null)}
                />
            )}

            <DeleteConfirmModal
                isOpen={!!deleteUserConfirm}
                title="Deletar usuário?"
                description={
                    deleteUserConfirm
                        ? `A conta de ${deleteUserConfirm.username} e todos os seus links serão removidos permanentemente.`
                        : ""
                }
                confirmLabel="Deletar"
                onConfirm={handleDeleteUser}
                onCancel={() => setDeleteUserConfirm(null)}
            />

            <DeleteConfirmModal
                isOpen={!!deleteLinkConfirm}
                title="Deletar link?"
                description={
                    deleteLinkConfirm
                        ? `O link "${deleteLinkConfirm.link.nameUrl}" será removido permanentemente.`
                        : "Esta ação não pode ser desfeita."
                }
                confirmLabel="Deletar"
                onConfirm={handleDeleteLink}
                onCancel={() => setDeleteLinkConfirm(null)}
            />
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLinks } from "@/hooks/useLinks";
import { useCreateLink } from "@/hooks/useCreateLink";
import { Navbar } from "@/components/Navbar";
import { LinkCard } from "@/components/LinkCard";
import { EditLinkModal } from "@/components/EditLinkModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Link2, Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { links, isLoading, fetchLinks, updateLink, deleteLink } = useLinks();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingLink, setEditingLink] = useState<{
        id: string;
        nameUrl: string;
        url: string;
    } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        success,
        onSubmit,
    } = useCreateLink(() => {
        fetchLinks();
        setShowCreateForm(false);
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/signin");
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchLinks();
        }
    }, [isAuthenticated, fetchLinks]);

    const handleDelete = async (id: string) => {
        try {
            await deleteLink(id);
            setDeleteConfirm(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = async (id: string, data: { nameUrl: string; url: string }) => {
        await updateLink(id, data);
    };

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-zinc-950">
            <Navbar />

            <main className="mx-auto max-w-4xl px-6 pt-24 pb-16">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Olá, {user?.username || "Usuário"} 👋
                        </h1>
                        <p className="mt-1 text-zinc-400">
                            Gerencie seus links favoritos
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-500 hover:to-cyan-500"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Link
                    </Button>
                </div>

                {/* Create Link Form */}
                {showCreateForm && (
                    <div className="mb-8 animate-slide-up glass rounded-2xl p-6">
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            Cadastrar Novo Link
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nameUrl" className="text-zinc-300">
                                        Nome do Link
                                    </Label>
                                    <Input
                                        id="nameUrl"
                                        type="text"
                                        placeholder="MeuGitHub"
                                        {...register("nameUrl")}
                                        className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
                                    />
                                    {errors.nameUrl && (
                                        <p className="text-sm text-red-400">{errors.nameUrl.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="url" className="text-zinc-300">
                                        URL
                                    </Label>
                                    <Input
                                        id="url"
                                        type="text"
                                        placeholder="https://github.com/user"
                                        {...register("url")}
                                        className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
                                    />
                                    {errors.url && (
                                        <p className="text-sm text-red-400">{errors.url.message}</p>
                                    )}
                                </div>
                            </div>

                            {errors.root?.serverError?.message && (
                                <p className="text-sm text-red-400">
                                    {errors.root.serverError.message}
                                </p>
                            )}

                            {success && (
                                <p className="text-sm text-emerald-400">{success}</p>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCreateForm(false)}
                                    className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/5"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-500 hover:to-cyan-500"
                                >
                                    {isSubmitting ? "Salvando..." : "Cadastrar"}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Links Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                    </div>
                ) : links.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20">
                        <div className="mb-4 rounded-2xl bg-violet-500/10 p-4">
                            <Link2 className="h-10 w-10 text-violet-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            Nenhum link cadastrado
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                            Clique em &quot;Novo Link&quot; para começar
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {links.map((link) => (
                            <div key={link.id} className="relative">
                                <LinkCard
                                    id={link.id}
                                    nameUrl={link.nameUrl}
                                    url={link.url}
                                    onEdit={() =>
                                        setEditingLink({
                                            id: link.id,
                                            nameUrl: link.nameUrl,
                                            url: link.url,
                                        })
                                    }
                                    onDelete={() => setDeleteConfirm(link.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Delete Confirmation */}
                {deleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl animate-slide-up">
                            <h3 className="text-lg font-bold text-white">Deletar Link?</h3>
                            <p className="mt-2 text-sm text-zinc-400">
                                Esta ação não pode ser desfeita.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 border-white/10 bg-transparent text-zinc-300 hover:bg-white/5"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 bg-red-600 text-white hover:bg-red-500"
                                >
                                    Deletar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {editingLink && (
                    <EditLinkModal
                        linkId={editingLink.id}
                        initialNameUrl={editingLink.nameUrl}
                        initialUrl={editingLink.url}
                        onSave={handleEdit}
                        onClose={() => setEditingLink(null)}
                    />
                )}
            </main>
        </div>
    );
}

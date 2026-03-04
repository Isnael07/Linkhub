"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLinks } from "@/hooks/useLinks";
import { Navbar } from "@/components/Navbar";
import { EditLinkModal } from "@/components/EditLinkModal";
import {
    DashboardHeader,
    CreateLinkForm,
    LinksGrid,
    DeleteConfirmModal,
} from "@/components/dashboard";
import { Loader2 } from "lucide-react";

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

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try {
            await deleteLink(deleteConfirm);
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
                <DashboardHeader
                    username={user?.username || "Usuário"}
                    onNewLink={() => setShowCreateForm(!showCreateForm)}
                />

                {showCreateForm && (
                    <CreateLinkForm
                        onSuccess={() => {
                            fetchLinks();
                            setShowCreateForm(false);
                        }}
                        onCancel={() => setShowCreateForm(false)}
                    />
                )}

                <LinksGrid
                    links={links}
                    isLoading={isLoading}
                    onEdit={(link) =>
                        setEditingLink({
                            id: link.id,
                            nameUrl: link.nameUrl,
                            url: link.url,
                        })
                    }
                    onDelete={(id) => setDeleteConfirm(id)}
                />

                <DeleteConfirmModal
                    isOpen={!!deleteConfirm}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteConfirm(null)}
                />

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

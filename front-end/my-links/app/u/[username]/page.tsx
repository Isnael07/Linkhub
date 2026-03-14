"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PublicLinkCard } from "@/components/PublicLinkCard";
import { Link2, Loader2, UserCircle, LinkIcon } from "lucide-react";
import Link from "next/link";

type LinkItem = {
    id: string;
    nameUrl: string;
    url: string;
};

export default function PublicUserLinksPage() {
    const params = useParams<{ username: string }>();
    const username = params.username;

    const [links, setLinks] = useState<LinkItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) return;

        async function fetchLinks() {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/links/public/${username}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setError("Usuário não encontrado.");
                    } else {
                        setError("Erro ao carregar os links.");
                    }
                    return;
                }
                const data = await res.json();
                setLinks(data);
            } catch {
                setError("Erro ao conectar ao servidor.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchLinks();
    }, [username]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-950">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px] animate-pulse-glow" />
                <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-cyan-600/20 blur-[120px] animate-pulse-glow" />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "64px 64px",
                }}
            />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold"
                >
                    <Link2 className="h-6 w-6 text-violet-400" />
                    <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                        MyLinks
                    </span>
                </Link>
            </header>

            {/* Content */}
            <main className="relative z-10 mx-auto max-w-2xl px-6 pt-8 pb-16">
                {/* User profile header */}
                <div className="mb-10 flex flex-col items-center text-center animate-slide-up">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/20">
                        <UserCircle className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white md:text-3xl">
                        @{username}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Links compartilhados
                    </p>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                        <p className="mt-3 text-sm text-zinc-400">
                            Carregando links...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <div className="flex flex-col items-center justify-center py-20 animate-slide-up">
                        <div className="rounded-full bg-red-500/10 p-4">
                            <LinkIcon className="h-8 w-8 text-red-400" />
                        </div>
                        <p className="mt-4 text-lg font-medium text-zinc-300">
                            {error}
                        </p>
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !error && links.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 animate-slide-up">
                        <div className="rounded-full bg-violet-500/10 p-4">
                            <LinkIcon className="h-8 w-8 text-violet-400" />
                        </div>
                        <p className="mt-4 text-lg font-medium text-zinc-300">
                            Nenhum link adicionado ainda.
                        </p>
                    </div>
                )}

                {/* Links list */}
                {!isLoading && !error && links.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {links.map((link, index) => (
                            <div
                                key={link.id}
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <PublicLinkCard
                                    nameUrl={link.nameUrl}
                                    url={link.url}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 px-6 py-6 text-center text-sm text-zinc-500">
                © 2026 MyLinks.
            </footer>
        </div>
    );
}

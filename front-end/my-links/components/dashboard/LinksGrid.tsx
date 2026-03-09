"use client";

import { LinkCard } from "@/components/LinkCard";
import { Link2, Loader2 } from "lucide-react";
import type { Link } from "@/hooks/useLinks";

type LinksGridProps = {
    links: Link[];
    isLoading: boolean;
    onEdit: (link: Link) => void;
    onDelete: (id: string) => void;
};

export function LinksGrid({ links, isLoading, onEdit, onDelete }: LinksGridProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
        );
    }

    if (links.length === 0) {
        return (
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
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {links.map((link) => (
                <div key={link.id} className="relative">
                    <LinkCard
                        id={link.id}
                        nameUrl={link.nameUrl}
                        url={link.url}
                        onEdit={() => onEdit(link)}
                        onDelete={() => onDelete(link.id)}
                    />
                </div>
            ))}
        </div>
    );
}

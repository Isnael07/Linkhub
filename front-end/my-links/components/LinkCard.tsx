"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";

type LinkCardProps = {
    id: string;
    nameUrl: string;
    url: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
};

export function LinkCard({ id, nameUrl, url, onEdit, onDelete }: LinkCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50 p-5 transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-violet-500/5">
            {/* Gradient accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold text-white">
                        {nameUrl}
                    </h3>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1.5 truncate text-sm text-zinc-400 transition-colors hover:text-violet-400"
                    >
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{url}</span>
                    </a>
                </div>

                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        onClick={() => onEdit(id)}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-cyan-400"
                        title="Editar"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(id)}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="Deletar"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

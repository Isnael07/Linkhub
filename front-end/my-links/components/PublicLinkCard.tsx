"use client";

import { ExternalLink } from "lucide-react";

type PublicLinkCardProps = {
    nameUrl: string;
    url: string;
};

export function PublicLinkCard({ nameUrl, url }: PublicLinkCardProps) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50 p-5 transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-0.5"
        >
            {/* Gradient accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {nameUrl}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{url}</span>
                    </p>
                </div>

                <div className="flex-shrink-0 rounded-lg bg-violet-500/10 p-2 text-violet-400 opacity-0 transition-all group-hover:opacity-100">
                    <ExternalLink className="h-4 w-4" />
                </div>
            </div>
        </a>
    );
}

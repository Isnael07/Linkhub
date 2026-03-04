"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type DashboardHeaderProps = {
    username: string;
    onNewLink: () => void;
};

export function DashboardHeader({ username, onNewLink }: DashboardHeaderProps) {
    return (
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Olá, {username} 👋
                </h1>
                <p className="mt-1 text-zinc-400">
                    Gerencie seus links favoritos
                </p>
            </div>
            <Button
                onClick={onNewLink}
                className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-500 hover:to-cyan-500"
            >
                <Plus className="mr-2 h-4 w-4" />
                Novo Link
            </Button>
        </div>
    );
}

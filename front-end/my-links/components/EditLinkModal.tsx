"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type EditLinkModalProps = {
    linkId: string;
    initialNameUrl: string;
    initialUrl: string;
    onSave: (id: string, data: { nameUrl: string; url: string }) => Promise<void>;
    onClose: () => void;
};

export function EditLinkModal({
    linkId,
    initialNameUrl,
    initialUrl,
    onSave,
    onClose,
}: EditLinkModalProps) {
    const [nameUrl, setNameUrl] = useState(initialNameUrl);
    const [url, setUrl] = useState(initialUrl);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await onSave(linkId, { nameUrl, url });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="mb-6 text-xl font-bold text-white">Editar Link</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-nameUrl" className="text-zinc-300">
                            Nome do Link
                        </Label>
                        <Input
                            id="edit-nameUrl"
                            value={nameUrl}
                            onChange={(e) => setNameUrl(e.target.value)}
                            className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
                            maxLength={20}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-url" className="text-zinc-300">
                            URL
                        </Label>
                        <Input
                            id="edit-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 border-white/10 bg-transparent text-zinc-300 hover:bg-white/5"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-500 hover:to-cyan-500"
                        >
                            {isSubmitting ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

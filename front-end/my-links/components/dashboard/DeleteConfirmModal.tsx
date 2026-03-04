"use client";

import { Button } from "@/components/ui/button";

type DeleteConfirmModalProps = {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export function DeleteConfirmModal({ isOpen, onConfirm, onCancel }: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl animate-slide-up">
                <h3 className="text-lg font-bold text-white">Deletar Link?</h3>
                <p className="mt-2 text-sm text-zinc-400">
                    Esta ação não pode ser desfeita.
                </p>
                <div className="mt-6 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1 border-white/10 bg-transparent text-zinc-300 hover:bg-white/5"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 text-white hover:bg-red-500"
                    >
                        Deletar
                    </Button>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, X, Eye, EyeOff } from "lucide-react";

type EditUserModalProps = {
    userId: string;
    initialUsername: string;
    email: string;
    onSave: (
        id: string,
        data: { username?: string; password?: string }
    ) => Promise<void>;
    onClose: () => void;
};

export function EditUserModal({
    userId,
    initialUsername,
    email,
    onSave,
    onClose,
}: Readonly<EditUserModalProps>) {
    const [username, setUsername] = useState(initialUsername);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (username.trim() !== initialUsername && username.trim().length < 3) {
            setError("O nome deve ter entre 3 e 20 caracteres.");
            return;
        }
        if (username.trim().length > 20) {
            setError("O nome deve ter entre 3 e 20 caracteres.");
            return;
        }
        if (password && (password.length < 8 || password.length > 16)) {
            setError("A senha deve ter entre 8 e 16 caracteres.");
            return;
        }

        const data: { username?: string; password?: string } = {};
        const newUsername = username.trim();
        if (newUsername !== initialUsername) data.username = newUsername;
        if (password) data.password = password;

        if (Object.keys(data).length === 0) {
            setError("Nenhuma alteração detectada");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(userId, data);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl animate-slide-up">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Fechar"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="mb-1 text-xl font-bold text-white">Editar Usuário</h2>
                <p className="mb-6 flex items-center gap-1.5 text-sm text-zinc-400">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    {email || "Sem email"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-user-username" className="text-zinc-300">
                            Nome de usuário
                        </Label>
                        <Input
                            id="edit-user-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
                            maxLength={20}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-user-password" className="text-zinc-300">
                            Nova senha{" "}
                            <span className="text-zinc-500">(deixe vazio para manter)</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="edit-user-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="border-white/10 bg-zinc-800 pr-10 text-white placeholder:text-zinc-500 focus:border-violet-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 transition-colors hover:text-white"
                                aria-label={
                                    showPassword ? "Ocultar senha" : "Mostrar senha"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}

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

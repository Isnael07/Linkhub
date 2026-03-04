"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Shield, Trash2 } from "lucide-react";

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { profile, isLoading, fetchProfile, updateProfile, deleteAccount } =
        useProfile();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState("");
    const [updateError, setUpdateError] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/signin");
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated, fetchProfile]);

    useEffect(() => {
        if (profile) {
            setUsername(profile.username);
        }
    }, [profile]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateSuccess("");
        setUpdateError("");
        setIsUpdating(true);

        try {
            const data: { username?: string; password?: string } = {};
            if (username !== profile?.username) data.username = username;
            if (password) data.password = password;

            if (Object.keys(data).length === 0) {
                setUpdateError("Nenhuma alteração detectada");
                setIsUpdating(false);
                return;
            }

            await updateProfile(data);
            setUpdateSuccess("Perfil atualizado com sucesso!");
            setPassword("");
        } catch (err) {
            setUpdateError(
                err instanceof Error ? err.message : "Erro ao atualizar"
            );
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
        } catch (err) {
            setUpdateError(
                err instanceof Error ? err.message : "Erro ao deletar conta"
            );
        }
    };

    if (authLoading || isLoading) {
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

            <main className="mx-auto max-w-2xl px-6 pt-24 pb-16">
                <h1 className="mb-8 text-3xl font-bold text-white">Meu Perfil</h1>

                {/* Profile Info Card */}
                <div className="mb-8 glass rounded-2xl p-6 animate-slide-up">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600">
                            <span className="text-2xl font-bold text-white">
                                {profile?.username ? profile.username[0].toUpperCase() : "?"}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {profile?.username}
                            </h2>
                            <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
                                <Mail className="h-3.5 w-3.5" />
                                {profile?.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div
                    className="mb-8 glass rounded-2xl p-6 animate-slide-up"
                    style={{ animationDelay: "0.1s" }}
                >
                    <div className="mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-violet-400" />
                        <h2 className="text-lg font-semibold text-white">
                            Editar Informações
                        </h2>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-zinc-300">
                                Username
                            </Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-zinc-300">
                                Nova Senha{" "}
                                <span className="text-zinc-500">(deixe vazio para manter)</span>
                            </Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
                            />
                        </div>

                        {updateError && (
                            <p className="text-sm text-red-400">{updateError}</p>
                        )}
                        {updateSuccess && (
                            <p className="text-sm text-emerald-400">{updateSuccess}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-500 hover:to-cyan-500"
                        >
                            {isUpdating ? "Atualizando..." : "Salvar Alterações"}
                        </Button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div
                    className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 animate-slide-up"
                    style={{ animationDelay: "0.2s" }}
                >
                    <div className="mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-400" />
                        <h2 className="text-lg font-semibold text-red-400">
                            Zona de Perigo
                        </h2>
                    </div>
                    <p className="mb-4 text-sm text-zinc-400">
                        Ao deletar sua conta, todos os seus dados e links serão permanentemente
                        removidos.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="border-red-500/30 bg-transparent text-red-400 hover:bg-red-500/10"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar Minha Conta
                    </Button>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl animate-slide-up">
                            <h3 className="text-lg font-bold text-white">
                                Tem certeza absoluta?
                            </h3>
                            <p className="mt-2 text-sm text-zinc-400">
                                Esta ação é irreversível. Todos os seus links e dados serão
                                deletados permanentemente.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 border-white/10 bg-transparent text-zinc-300 hover:bg-white/5"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 bg-red-600 text-white hover:bg-red-500"
                                >
                                    Sim, deletar minha conta
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

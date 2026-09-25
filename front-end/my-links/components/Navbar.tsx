"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { LogOut, User, LayoutDashboard, Link2, Shield } from "lucide-react";

export function Navbar() {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const pathname = usePathname();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    if (!isAuthenticated) return null;

    const isAdminPage = pathname.startsWith("/admin");
    const showDashboardLink = !isAdminPage && !isAdmin;
    const homeHref = isAdmin ? "/admin/usuarios" : "/dashboard";

    return (
        <>
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                {/* Logo */}
                <Link
                    href={homeHref}
                    className="flex items-center gap-2 text-xl font-bold tracking-tight"
                >
                    <Link2 className="h-6 w-6 text-violet-400" />
                    <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                        MyLinks
                    </span>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-1">
                    {showDashboardLink && (
                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === "/dashboard"
                                    ? "bg-white/10 text-white"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                    )}

                    <Link
                        href="/profile"
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === "/profile"
                                ? "bg-white/10 text-white"
                                : "text-zinc-400 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <User className="h-4 w-4" />
                        {user?.username || "Perfil"}
                    </Link>

                    {isAdmin && (
                        <Link
                            href="/admin/usuarios"
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isAdminPage
                                    ? "bg-white/10 text-white"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Shield className="h-4 w-4" />
                            Usuários
                        </Link>
                    )}

                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut className="h-4 w-4" />
                        Sair
                    </button>
                </div>
            </div>
        </nav>
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
                        <h2 className="mb-3 text-xl font-bold text-white">Confirmar saída</h2>
                        <p className="mb-6 text-sm leading-6 text-zinc-400">
                            Você tem certeza que deseja sair? Esta ação fará logout e retornará para a tela de login.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => setShowLogoutConfirm(false)}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={logout}
                                className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
                            >
                                Confirmar saída
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

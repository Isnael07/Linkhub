"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { LogOut, User, LayoutDashboard, Link2 } from "lucide-react";

export function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const pathname = usePathname();

    if (!isAuthenticated) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                {/* Logo */}
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-xl font-bold tracking-tight"
                >
                    <Link2 className="h-6 w-6 text-violet-400" />
                    <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                        MyLinks
                    </span>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-1">
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

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut className="h-4 w-4" />
                        Sair
                    </button>
                </div>
            </div>
        </nav>
    );
}

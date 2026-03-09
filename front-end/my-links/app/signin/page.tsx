"use client";

import Link from "next/link";
import { SigninForm } from "@/components/SigninForm";
import { Link2 } from "lucide-react";

export default function SigninPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4">
      {/* Background effects */}
      <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-cyan-600/15 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold">
          <Link2 className="h-7 w-7 text-violet-400" />
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            MyLinks
          </span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <h1 className="mb-2 text-center text-2xl font-bold text-white">
            Bem-vindo de volta
          </h1>
          <p className="mb-6 text-center text-sm text-zinc-400">
            Entre na sua conta para gerenciar seus links
          </p>

          <SigninForm />

          <div className="mt-6 text-center text-sm text-zinc-400">
            Não tem conta?{" "}
            <Link
              href="/signup"
              className="font-medium text-violet-400 transition-colors hover:text-violet-300"
            >
              Crie uma agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

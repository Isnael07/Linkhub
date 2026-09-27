import Link from "next/link";
import { Link2, ArrowRight, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-cyan-600/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[160px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Link2 className="h-6 w-6 text-violet-400" />
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            MyLinks
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-violet-500 hover:to-cyan-500 hover:shadow-lg hover:shadow-violet-500/20"
          >
            Criar Conta
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center px-6 pt-20 pb-32 text-center md:pt-32">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 animate-slide-up">
          <Zap className="h-3.5 w-3.5" />
          Rápido, seguro e elegante
        </div>

        <h1
          className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Todos os seus{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            links
          </span>{" "}
          em um só lugar
        </h1>

        <p
          className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 md:text-xl animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          Centralize, organize e compartilhe seus links mais importantes.
          Simples, rápido e com design premium.
        </p>

        {/* CTAs */}
        <div
          className="mt-10 flex flex-col gap-4 sm:flex-row animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/signup"
            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:from-violet-500 hover:to-cyan-500 hover:shadow-xl hover:shadow-violet-500/25"
          >
            Começar Agora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/signin"
            className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-zinc-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Já tenho conta
          </Link>
        </div>

        {/* Feature cards */}
        <div
          className="mt-24 grid w-full max-w-4xl gap-6 sm:grid-cols-2 animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="glass rounded-2xl p-6 text-left transition-all hover:border-violet-500/20">
            <div className="mb-4 inline-flex rounded-xl bg-violet-500/10 p-3">
              <Link2 className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Links Organizados</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Crie, edite e delete seus links favoritos de forma simples.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 text-left transition-all hover:border-purple-500/20">
            <div className="mb-4 inline-flex rounded-xl bg-purple-500/10 p-3">
              <Globe className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Acesso Rápido</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Acesse seus links de qualquer lugar, a qualquer momento.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-6 text-center text-sm text-zinc-500">
        © 2026 MyLinks.
      </footer>
    </div>
  );
}

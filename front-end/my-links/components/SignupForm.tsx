"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/hooks/useSignup";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    success,
    onSubmit,
  } = useSignup();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-zinc-300">
          Username
        </Label>
        <Input
          id="username"
          placeholder="Seu nome de usuário"
          {...register("username")}
          className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.username && (
          <p className="text-sm text-red-400">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-300">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="email@exemplo.com"
          {...register("email")}
          className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-zinc-300">
          Senha
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            {...register("password")}
            className="border-white/10 bg-zinc-800 pr-10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 transition-colors hover:text-white focus:outline-none"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      {errors.root?.serverError?.message && (
        <p className="text-sm text-red-400">
          {errors.root.serverError.message}
        </p>
      )}

      {success && <p className="text-sm text-emerald-400">{success}</p>}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-500 hover:to-cyan-500"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Criando conta..." : "Criar Conta"}
      </Button>
    </form>
  );
}

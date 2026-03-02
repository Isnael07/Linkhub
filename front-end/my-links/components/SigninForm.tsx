"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSignin } from "@/hooks/useSignin";

export function SigninForm() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    success,
    onSubmit,
  } = useSignin();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      {errors.root?.serverError?.message && (
        <p className="text-sm text-red-400">
          {errors.root.serverError.message}
        </p>
      )}

      {success && (
        <p className="text-sm text-emerald-400">{success}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-500 hover:to-cyan-500"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}

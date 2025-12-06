"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/hooks/userSignup";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  } = useSignup();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register("username")} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" {...register("password")} />
      </div>

      {errors.root?.serverError?.message && (
        <p className="text-red-500 text-sm">
          {errors.root.serverError.message}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Criando conta..." : "Criar Conta"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/schemas/signupSchema";
import { useRouter } from "next/navigation";

export function useSignup() {
  const router = useRouter();
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || "Erro ao criar conta");
      }

      setSuccess("Conta criada com sucesso!");
      router.push("/signin");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro inesperado.";
      setError("root.serverError", {
        type: "server",
        message,
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    success,
    onSubmit,
  };
}

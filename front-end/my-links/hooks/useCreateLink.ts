"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { LinkFormData } from "@/schemas/linkSchema";
import { useAuth } from "@/contexts/AuthContext";

export function useCreateLink(onSuccess?: () => void) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LinkFormData>({
    defaultValues: {
      nameUrl: "",
      url: "",
    },
  });

  const [success, setSuccess] = useState("");

  async function onSubmit(data: LinkFormData) {
    setSuccess("");

    try {
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          userId: user.userId,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Erro ao criar link");
      }

      setSuccess("Link cadastrado com sucesso!");
      reset();
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro inesperado.";

      setError("root.serverError", {
        type: "server",
        message,
      });
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    success,
    onSubmit,
  };
}

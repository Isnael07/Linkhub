"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { LinkFormData } from "@/schemas/linkSchema";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { handleFormError } from "@/lib/formUtils";

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

      await apiFetch("/links", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          userId: user.userId,
        }),
      });

      setSuccess("Link cadastrado com sucesso!");
      reset();
      onSuccess?.();
    } catch (err) {
      handleFormError(err, setError);
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

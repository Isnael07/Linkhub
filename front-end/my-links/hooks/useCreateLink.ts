"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { LinkFormData } from "@/schemas/linkSchema";

export function useCreateLink() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      nameUrl: "",
      url: "",
      userId: ""
    }
  });

  const [success, setSuccess] = useState("");

  async function onSubmit(data: LinkFormData) {
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8080/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...data,
          userId: data.userId.trim()
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Erro ao criar link");
      }

      setSuccess("Link cadastrado com sucesso!");
      reset();

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("root.serverError", {
          type: "server",
          message: err.message,
        });
      } else {
        setError("root.serverError", {
          type: "server",
          message: "Erro inesperado.",
        });
      }
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    success,
    onSubmit
  };
}

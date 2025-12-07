"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { LinkFormData } from "@/schemas/linkSchema";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  exp: number;
  roles?: string[];
};

export function useCreateLink() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<LinkFormData>({
    defaultValues: {
      nameUrl: "",
      url: "",
    }
  });

  const [success, setSuccess] = useState("");

  async function onSubmit(data: LinkFormData) {
    setSuccess("");

    try {
      const token = localStorage.getItem("jwt");

      console.log("JWT enviado:", token);

      if (!token) {
        throw new Error("Usuário não autenticado.");
      }

      const decoded = jwtDecode<JwtPayload>(token);
      const userId = decoded.sub;

      console.log("Payload enviado:", { ...data, userId });

      const res = await fetch("http://localhost:8080/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          userId,
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Erro ao criar link");
      }

      setSuccess("Link cadastrado com sucesso!");
      reset();

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
    onSubmit
  };
}

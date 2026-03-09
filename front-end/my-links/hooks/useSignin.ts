"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninFormData } from "@/schemas/sigininSchema";
import { useAuth } from "@/contexts/AuthContext";

export function useSignin() {
  const { login } = useAuth();
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormData) => {
    try {
      await login(data.email, data.password);
      setSuccess("Login realizado com sucesso!");
    } catch (err) {
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

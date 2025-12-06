"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninFormData } from "@/schemas/sigininSchema";

export function useSignin() {
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema)
  });

  const onSubmit = async (data: SigninFormData) => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const jwt = await response.text();

      setSuccess(jwt);

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

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
    formState: { errors, isSubmitting }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let message = "Erro ao criar conta";

        try {
          const body = await response.clone().json();
          if (body?.message) message = body.message;
        } catch {
          // ignore JSON parsing errors
        }

        throw new Error(message);
      }

      setSuccess("Conta criada com sucesso!");

      router.push("/signin");

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

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninFormData } from "@/schemas/sigininSchema";
import { useRouter } from "next/navigation";

export function useSignin() {
  const router = useRouter();
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

    const { acessesToken } = await response.json();

    localStorage.setItem("jwt", acessesToken);

    setSuccess("Login realizado com sucesso!");
    router.push("/createlinks");

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

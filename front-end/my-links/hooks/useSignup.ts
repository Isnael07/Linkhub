"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/schemas/signupSchema";
import { apiFetch } from "@/lib/api";
import { handleFormError } from "@/lib/formUtils";
import { useAuth } from "@/contexts/AuthContext";

export function useSignup() {
  const { login } = useAuth();
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
      await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setSuccess("Conta criada com sucesso!");

      await login(data.email, data.password);
    } catch (err: unknown) {
      handleFormError(err, setError);
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

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninFormData } from "@/schemas/sigininSchema";
import { useAuth } from "@/contexts/AuthContext";
import { handleFormError } from "@/lib/formUtils";

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

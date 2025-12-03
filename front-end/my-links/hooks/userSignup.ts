"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao criar conta");
      }

      router.push("/signin");

    } catch (err: any) {
      setError(err.message || "Erro inesperado");
    }

    setLoading(false);
  }

  return {
    form,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
}

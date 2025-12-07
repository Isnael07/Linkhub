"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateLink } from "@/hooks/useCreateLink";

export function CreateLinkForm() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    success,
    onSubmit
  } = useCreateLink();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* nameUrl */}
      <div className="space-y-1">
        <Label htmlFor="nameUrl">Nome do Link</Label>
        <Input
          id="nameUrl"
          type="text"
          placeholder="MeuGitHub"
          {...register("nameUrl")}
        />
        {errors.nameUrl && (
          <p className="text-red-500 text-sm">{errors.nameUrl.message}</p>
        )}
      </div>

      {/* url */}
      <div className="space-y-1">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="text"
          placeholder="https://exemplo.com"
          {...register("url")}
        />
        {errors.url && (
          <p className="text-red-500 text-sm">{errors.url.message}</p>
        )}
      </div>

      {/* erro global */}
      {errors.root?.serverError?.message && (
        <p className="text-red-500 text-sm">
          {errors.root.serverError.message}
        </p>
      )}

      {/* sucesso */}
      {success && (
        <p className="text-green-600 text-sm">{success}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Cadastrar"}
      </Button>
    </form>
  );
}

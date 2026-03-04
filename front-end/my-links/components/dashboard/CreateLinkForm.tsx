"use client";

import { useCreateLink } from "@/hooks/useCreateLink";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type CreateLinkFormProps = {
    onSuccess: () => void;
    onCancel: () => void;
};

export function CreateLinkForm({ onSuccess, onCancel }: CreateLinkFormProps) {
    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        success,
        onSubmit,
    } = useCreateLink(onSuccess);

    return (
        <div className="mb-8 animate-slide-up glass rounded-2xl p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
                Cadastrar Novo Link
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nameUrl" className="text-zinc-300">
                            Nome do Link
                        </Label>
                        <Input
                            id="nameUrl"
                            type="text"
                            placeholder="MeuGitHub"
                            {...register("nameUrl")}
                            className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
                        />
                        {errors.nameUrl && (
                            <p className="text-sm text-red-400">{errors.nameUrl.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="url" className="text-zinc-300">
                            URL
                        </Label>
                        <Input
                            id="url"
                            type="text"
                            placeholder="https://github.com/user"
                            {...register("url")}
                            className="border-white/10 bg-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500"
                        />
                        {errors.url && (
                            <p className="text-sm text-red-400">{errors.url.message}</p>
                        )}
                    </div>
                </div>

                {errors.root?.serverError?.message && (
                    <p className="text-sm text-red-400">
                        {errors.root.serverError.message}
                    </p>
                )}

                {success && (
                    <p className="text-sm text-emerald-400">{success}</p>
                )}

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/5"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-500 hover:to-cyan-500"
                    >
                        {isSubmitting ? "Salvando..." : "Cadastrar"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

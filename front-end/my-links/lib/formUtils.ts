import { UseFormSetError, FieldValues, Path } from "react-hook-form";

export function handleFormError<T extends FieldValues>(
    err: unknown,
    setError: UseFormSetError<T>
) {
    const message = err instanceof Error ? err.message : "Erro inesperado.";
    setError("root.serverError" as Path<T>, {
        type: "server",
        message,
    });
}

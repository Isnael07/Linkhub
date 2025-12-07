import { z } from "zod";

export const linkSchema = z.object({
  nameUrl: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(20, "Máximo de 20 caracteres"),

  url: z
    .string()
    .min(1, "A URL é obrigatória"),
});

export type LinkFormData = z.infer<typeof linkSchema>;

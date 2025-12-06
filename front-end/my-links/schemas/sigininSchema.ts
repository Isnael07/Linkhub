import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .email("E-mail inválido"),
  password: z
    .string()
    .min(6, "A senha deve ter ao menos 6 caracteres"),
});

export type SigninFormData  = z.infer<typeof signinSchema>;

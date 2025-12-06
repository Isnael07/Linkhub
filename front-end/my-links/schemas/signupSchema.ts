import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "O nome deve ter ao menos 3 caracteres"),
  email: z
    .email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter ao menos 8 caracteres"),
});

export type SignupFormData = z.infer<typeof signupSchema>;

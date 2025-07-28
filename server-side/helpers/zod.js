import { email, z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role_id: z
    .number()
    .int()
    .refine((val) => [2, 3].includes(val)),
});

export const loginSchema = z.object({
  email: z.string().email().min(1, "cannot be empty"),
  password: z.string().min(1, "cannot be empty")
})
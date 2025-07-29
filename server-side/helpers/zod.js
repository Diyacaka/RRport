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

export const guardianRegisterSchema = z.object({
  full_name: z.string().min(1, 'cannot be empty'),
  relations: z.enum([
    "Father","Mother","Aunt","Uncle","Brother","Sister"
  ],{required_error: 'Field cannot be empty'}),
  job: z.string().min(1, "cannot be empty"),
  address: z.string().min(1, 'cannot be empty'),
  phone_number: z.string().min(10, 'cannot be empty'),
  emergency_number: z.string().optional()
})

import { z } from "zod";



///// - USER SECTION - /////

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
  password: z.string().min(1, "cannot be empty"),
});

export const guardianRegisterSchema = z.object({
  full_name: z.string().min(1, "cannot be empty"),
  photo_profile: z.string().optional(),
  relations: z.enum(
    ["Father", "Mother", "Aunt", "Uncle", "Brother", "Sister"],
    { required_error: "Field cannot be empty" }
  ),
  job: z.string().min(1, "cannot be empty"),
  address: z.string().min(1, "cannot be empty"),
  phone_number: z.string().min(10, "cannot be empty"),
  emergency_number: z.string().optional(),
});

export const guardianUpdateSchema = z.object({
  full_name: z.string().optional(),
  relations: z.enum(
    ["Father", "Mother", "Aunt", "Uncle", "Brother", "Sister"],
    { required_error: "Field cannot be empty" }
  ),
  job: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  emergency_number: z.string().optional(),
});

///// - STUDENT SECTION - /////

export const studentRegisterSchema = z.object({
  full_name: z.string().min(1, "field cannot be empty"),
  photo_profile: z.string().url("Photo must be valid").optional(),
  gender: z.enum(["male", "female"]),
  address: z.string().optional(),
  birth_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format (expected YYYY-MM-DD)",
  }),
  nisn: z.string().min(1, "field cannot be empty"),
  classes: z.string().min(1, "field cannot be empty"),
  relationship: z.enum(['Father', 'Mother', 'Uncle', 'Aunt', 'Brother', 'Sister'])
});

export const studentUpdateSchema = z.object({
  full_name: z.string().min(1).optional(),
  photo_profile: z.string().url().optional(),
  address: z.string().optional(),
  nisn: z.string().optional(),
  classes: z.string().optional(),
});

///// - TEACHER SECTION - /////

export const teacherRegisterSchema = z.object({
  full_name: z.string().min(1,'field cannot be empty'),
  nip: z.string().min(1, 'field cannot be empty'),
  subject: z.enum(['wali kelas', 'guru mapel'],{ required_error:"Pick one of the subject"}),
  phone_number: z.string().min(10, 'field cannot be empty'),
  address: z.string().min(1, 'field cannot be empty'),
  photo_profile: z.string().optional()
})

export const teacherUpdateSchema = z.object({
  full_name: z.string().min(1).optional(),
  nip: z.string().min(1).optional(),
  subject: z.enum(['wali kelas', 'guru mapel']).optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  photo_profile: z.string().optional()
})

///// -ADMIN- /////

export const newAdminSchema = z.object({
  full_name : z.string().min(1, `field cannot be empty`),
  phone_number : z.string().min(20, `field cannot be empty`),
  emergency_number : z.string().min(20).optional(),
  address : z.string().min(1,`field cannot be empty`),
  photo_profile :z.string().url().optional()
})

export const updateAdminSChema = z.object({
  full_name : z.string().optional(),
  phone_number : z.string().optional(),
  emergency_number : z.string().optional(),
  address : z.string().optional(),
  photo_profile : z.string().optional()
})
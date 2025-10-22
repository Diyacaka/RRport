import { array, z } from "zod";

///// - USER SECTION - /////

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role_id: z
    .preprocess(
      (val) => {
        if (val === undefined || val === null || val === "") {
          return 3;
        }
        return Number(val);
      },
      z
        .number()
        .int()
        .refine((val) => [2, 3].includes(val), {
          message: `Forbidden access`,
        })
    )
    .default(3),
});

export const loginSchema = z.object({
  email: z.string().email().min(1, "cannot be empty"),
  password: z.string().min(1, "cannot be empty"),
});

export const guardianRegisterSchema = z.object({
  full_name: z.string().min(1, "cannot be empty"),
  photo_profile: z.string().url().optional(),
  address: z.string().min(1, "cannot be empty"),
  phone_number: z.string().min(10, "cannot be empty"),
  emergency_number: z.string().optional(),
  occupation_id: z.preprocess((val) => Number(val), z.number()),
});

export const guardianUpdateSchema = z.object({
  full_name: z.string().optional(),
  photo_profile: z.string().url().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  emergency_number: z.string().optional(),
  occupation_id: z.preprocess((val) => {
    if (val === null || val === undefined || val === "") {
      return undefined;
    }
    return Number(val);
  }, z.number().optional()),
  relationship_id: z.preprocess((val) => {
    if (val === null || val === undefined || val === "") {
      return undefined;
    }
    return Number(val);
  }, z.number().optional()),
});

///// - STUDENT SECTION - /////

export const studentRegisterSchema = z.object({
  class_id: z.preprocess((val) => Number(val), z.number()),
  full_name: z.string().min(1, "field cannot be empty"),
  photo_profile: z.string().url("Photo must be valid").optional(),
  gender: z.enum(["Male", "Female"]),
  address: z.string().optional(),
  birth_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format (expected YYYY-MM-DD)",
  }),
  nisn: z.string().min(1, "field cannot be empty"),
  relationship_id: z.preprocess((val) => Number(val), z.number()),
});

export const studentUpdateSchema = z.object({
  class_id: z.preprocess((val) => Number(val), z.number()),
  full_name: z.string().min(1).optional(),
  photo_profile: z.string().url().optional(),
  address: z.string().optional(),
  nisn: z.string().optional(),
});

///// - TEACHER SECTION - /////

export const teacherRegisterSchema = z.object({
  full_name: z.string().min(1, "field cannot be empty"),
  nip: z.string().min(1, "field cannot be empty"),
  phone_number: z.string().min(10, "field cannot be empty"),
  emergency_number: z.string().optional(),
  address: z.string().min(1, "field cannot be empty"),
  photo_profile: z.string().optional(),
  sub_role_id: z.preprocess((val) => {
    if (Array.isArray(val)) return val.map(Number);
    if (typeof val === "string") return [Number(val)];
    return [];
  }, z.array(z.number()).min(1, "field at least need 1 sub role")),
  subject_id: z.preprocess((val) => {
    if (Array.isArray(val)) return val.map(Number);
    if (typeof val === "string") return [Number(val)];
    return [];
  }, z.array(z.number()).min(1, "field at least need 1 subject")),
});

export const teacherUpdateSchema = z.object({
  full_name: z.string().optional(),
  nip: z.string().optional(),
  phone_number: z.string().optional(),
  emergency_number: z.string().optional(),
  address: z.string().optional(),
  photo_profile: z.url().optional(),
  sub_role_id: z.preprocess((val) => {
    if (val === undefined || val === "" || val === null) return undefined;
    if (Array.isArray(val)) return val.map(Number);
    if (typeof val === "string") return [Number(val)];
    return undefined;
  }, z.array(z.number()).optional()),
  subject_id: z.preprocess((val) => {
    if (val === undefined || val === "" || val === null) return undefined;
    if (Array.isArray(val)) return val.map(Number);
    if (typeof val === "string") return [Number(val)];
    return undefined;
  }, z.array(z.number()).optional()),
});

///// -TEACHER/REPORT- /////

export const newReportSchema = z.object({
  semester: z.enum(["1", "2", "1/2"]),
  academic_year: z.string().min(1, "Field required"),
  // report_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
  //   message: "Invalid date format (expected YYYY-MM-DD)",
  // }),
  // report_date: z.string(),
  remarks: z.string().optional(),
});

export const reportDetailSchema = z.object({
  score: z.array(
    z.object({
      subject_id: z.number(),
      score: z.number(),
    })
  ),
});

///// -ADMIN- /////

export const newAdminSchema = z.object({
  full_name: z.string().min(1, `field cannot be empty`),
  phone_number: z.string().min(20, `field cannot be empty`),
  emergency_number: z.string().min(20).optional(),
  address: z.string().min(1, `field cannot be empty`),
  photo_profile: z.string().url().optional(),
});

export const updateAdminSChema = z.object({
  full_name: z.string().optional(),
  phone_number: z.string().optional(),
  emergency_number: z.string().optional(),
  address: z.string().optional(),
  photo_profile: z.string().optional(),
});

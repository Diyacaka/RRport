// import { studentRegisterSchema } from "../helpers/zod.js";
// import { getStudentId, newStudent } from "../models/student_model.js";

// export async function getStudentIdHandler(req, res, next) {
//   try {
//     const { id } = req.body;
//     const result = await getStudentId(id);
//     if (!result) {
//       res.status(404).json({ messages: "Student with Id does not exist" });
//     }

//     return res.status(201).json({ data: result });
//   } catch (error) {
//     throw error;
//   }
// }

// export async function newStudentHandler(req, res, next) {
//   try {
//     const { id: user_id, role: role_id } = req.user;
//     const body = studentRegisterSchema.parse(req.body);
//     const result = await newStudent(
//       user_id,
//       body.full_name,
//       role_id,
//       body.gender,
//       body.address,
//       body.birth_date,
//       body.nisn,
//       body.classes
//     );

//     return res.status(201).json({ messages: "register succes", data: result });
//   } catch (error) {
//     throw error;
//   }
// }

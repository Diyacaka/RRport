import { teacherRegisterSchema } from "../../helpers/zod.js";
import { newTeacher } from "../../models/admin_techerSide_model/teacher_model";

export async function newTeacherHandler(req, res, next) {
  try {
    const { id: user_id, role: role_id } = req.user;
    if (req.user.isProfileComplete) {
      return res.status(400).json({
        messages: "Profile already completed",
      });
    }
    const { full_name, nip, subject, phone_number, address, photo_profile } =
      teacherRegisterSchema(req.body);
    const result = await newTeacher(
      user_id,
      full_name,
      role_id,
      nip,
      subject,
      phone_number,
      address,
      photo_profile
    );

    return res.status(201).json({ messages: `register success`, data: result });
  } catch (error) {
    throw error;
  }
}

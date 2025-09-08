import { teacherRegisterSchema } from "../../helpers/zod.js";
import {
  getGuardianWardsByName,
  newTeacher,
} from "../../models/admin_techerSide_model/teacher_model.js";

export async function getGuardianWardsByNameHandler(req, res, next) {
  try {
    const { full_name } = req.query;

    const rawData = await getGuardianWardsByName(full_name);
    if (rawData.length === 0) {
      return res.status(404).json({ messages: `Guardian not found` });
    }

    const guardian = {};

    rawData.forEach((row) => {
      if (!guardian[row.guardian_id]) {
        guardian[row.guardian_id] = {
          guardian_id: row.guardian_id,
          guardian_name: row.guardian_name,
          guardian_photo: row.guardian_photo,
          guardian_address: row.guardian_address,
          guarddian_phone_number: row.guardian_phone_number,
          wards: [],
        };
      }

      guardian[row.guardian_id].wards.push({
        student_id: row.student_id,
        student_name: row.student_name,
        student_photo: row.student_photo,
        student_gender: row.student_gender,
        student_address: row.student_address,
        student_birthdate: row.student_birthdate,
        student_nisn: row.student_nisn,
        student_class: row.student_class,
        relationship: row.relationship,
      });
    });

    const guardianArray = Object.values(guardian);

    return res.status(200).json({ result: guardianArray });
  } catch (error) {
    throw error;
  }
}

export async function newTeacherHandler(req, res, next) {
  try {
    const { id: user_id, role: role_id } = req.user;
    if (req.user.isProfileComplete) {
      return res.status(400).json({
        messages: "Profile already completed",
      });
    }
    const {
      full_name,
      sub_role,
      nip,
      subject,
      phone_number,
      address,
      photo_profile,
    } = teacherRegisterSchema.parse(req.body);
    const result = await newTeacher(
      user_id,
      full_name,
      role_id,
      sub_role,
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

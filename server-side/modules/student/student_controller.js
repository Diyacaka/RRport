import { NotFoundError } from "../../helpers/enhanchedError.js";
import { studentRegisterSchema, studentUpdateSchema } from "../../helpers/zod.js";
import { getGuardianID } from "../guardian/guardian_model.js";
import {
  getAllStudent,
  getStudentById,
  getStudentName,
  newStudent,
  newStudentGuardian,
  updateStudent,
} from "./student_model.js";

export async function getStudentByIdHandler(req, res, next) {
  try {
    const { id } = req.params;

    const result = await getStudentById(id);

    if (!result) {
      throw new NotFoundError(`Student with id ${id} does not exist`);
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function findListedStudent(req, res, next) {
  try {
    const { full_name } = req.query;
    const { id: user_id } = req.user;

    let result;
    const guardian = await getGuardianID(user_id);
    // console.log(guardian, 'guardian');

    if (!guardian) {
      throw new NotFoundError(`Guardian with id ${user_id} does not exist`);
    }
    if (full_name) {
      const student = await getStudentName(full_name);
      // console.log(student);

      if (!student || student.length === 0) {
        throw new NotFoundError(
          `Student with name ${full_name} does not exist`
        );
      }

      result = student.map((s) => {
        if (req.user.role === 1 || req.user.role === 2) {
          return {
            full_name: s.full_name,
            photo_profile: s.photo_profile,
            gender: s.gender,
            address: s.address,
            birth_date: s.birth_date,
            nisn: s.nisn,
            class: s.class_name,
            grade_level: s.grade_level,
            desc: s.description,
          };
        }

        if (s.guardian_id === guardian.guardian_id) {
          return {
            full_name: s.full_name,
            photo_profile: s.photo_profile,
            gender: s.gender,
            address: s.address,
            birth_date: s.birth_date,
            nisn: s.nisn,
            class: s.class_name,
            grade_level: s.grade_level,
            desc: s.description,
          };
        }
        return {
          full_name: s.full_name,
          photo_profile: s.photo_profile,
          class: s.class_name,
        };
      });
    } else {
      result = await getAllStudent();
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function newStudentHandler(req, res, next) {
  try {
    const user_id = req.user.id;
    const {role} = req.user

    let tempGuardian_id;

    if (role === 3) {
      const guardian = await getGuardianID(user_id);
      if (!guardian) {
        throw new NotFoundError("Guardian", user_id)
      }
      tempGuardian_id = guardian.guardian_id;
    } else {
      tempGuardian_id = req.body.guardian_id;
    }

    const studentForm = studentRegisterSchema.parse(req.body);

    let photoUrl = null;
    if (req.file) {
      photoUrl = req.file.path;
    }

    const result = await newStudent(
      tempGuardian_id,
      studentForm.class_id,
      studentForm.full_name,
      photoUrl,
      studentForm.gender,
      studentForm.address,
      studentForm.birth_date,
      studentForm.nisn,
      user_id
    );

    const link = await newStudentGuardian(
      tempGuardian_id,
      result.id,
      studentForm.relationship_id
    );

    return res
      .status(200)
      .json({ message: `new student added`, data: result, link: link });
  } catch (error) {
    next(error);
  }
}

export async function updateStudentHandler(req, res, next) {
  try {
    const user_id = req.user.id;
    const student_id = req.params.student_id;
    // console.log(user_id, "<<<userid");
    // console.log(student_id, "<<<studentid");

    const student = await getStudentById(student_id);
    if (!student) {
      throw new NotFoundError(`student with ${student_id} does not exist`);
    }    
    
    const studentForm = studentUpdateSchema.parse(req.body);

    let photoUrl = student.photo_profile;
    if (req.file) {
      photoUrl = req.file.path;
    }

    const result = await updateStudent(
      student_id,
      studentForm.class_id,
      studentForm.full_name,
      photoUrl,
      studentForm.address,
      studentForm.nisn,
      user_id
    );

    return res.status(200).json({
      messages: `Profile with id ${student_id} has been updated`,
      date: result,
    });
  } catch (error) {
    next(error);
  }
}

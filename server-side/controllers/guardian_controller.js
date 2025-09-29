import {
  guardianRegisterSchema,
  guardianUpdateSchema,
  studentRegisterSchema,
  studentUpdateSchema,
} from "../helpers/zod.js";
import {
  getGuardianID,
  getGuardianIdByUIDuser,
  getGuardianName,
  // getStudentGuardian,
  getStudentProfile,
  getStudentName,
  newGuardian,
  newStudent,
  newStudentGuardian,
  updateGuardian,
  updateStudent,
  getStudentById,
  getAllStudent,
} from "../models/guardian_model.js";

import { NotFoundError } from "../helpers/enhanchedError.js";

////////// - GUARDIAN SECTION - //////////

export async function getGuardianIDHandler(req, res, next) {
  try {
    const { id } = req.params;
    // console.log(id);

    const result = await getGuardianID(id);

    if (!result) {
      throw new NotFoundError();
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getGuardianNameHandler(req, res, next) {
  try {
    const { full_name } = req.query;

    const result = await getGuardianName(full_name);

    if (!result) {
      throw new NotFoundError(`Guardian With ${full_name} does not exist`);
    }

    return res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
}

// export async function getStudentGuardianHandler(req, res, next) {
//   try {
//     const guardian = await getGuardianID(req.user.id);
//     if (!guardian) {
//       throw new NotFoundError();
//     }
//     // const {guardian_id} = await getGuardianIdByUIDuser(guardian)
//     console.log(guardian);

//     const rows = await getStudentGuardian(guardian.guardian_id);
//     // console.log(rows);

//     const wards = rows.map((temp) => ({
//       id: temp.student_id,
//       name: temp.student_name,
//       photo: temp.student_photo,
//       gender: temp.student_gender,
//       address: temp.student_address,
//       birthDate: temp.student_birtDate,
//       nisn: temp.student_nisn,
//       class: temp.student_calss,
//       // relationship: temp.relationship
//     }));

//     return res.status(200).json({
//       guardian: {
//         id: guardian.guardian_id,
//         name: guardian.full_name,
//         photo: guardian.photo_profile || "",
//         relationship: guardian.relations,
//         address: guardian.address,
//         phone: guardian.phone_number,
//       },
//       wards,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

export async function newGuardianHandler(req, res, next) {
  try {
    const { id: user_id } = req.user;

    if (req.user.isProfileComplete) {
      return res.status(400).json({
        message: "Profile already completed",
      });
    }

    const guardianForm = guardianRegisterSchema.parse(req.body);
    // console.log(req.body);

    const result = await newGuardian(
      user_id,
      guardianForm.full_name,
      guardianForm.photo_profile,
      guardianForm.address,
      Number(guardianForm.occupation_id),
      guardianForm.emergency_number,
      guardianForm.occupation_id
    );

    return res
      .status(200)
      .json({ messages: "Profile completion successul", data: result });
  } catch (error) {
    throw error;
  }
}

export async function updateGuardianHandler(req, res, next) {
  try {
    const userLoggedIn = req.user.id;

    const guardians = await getGuardianIdByUIDuser(req.user.id);
    const guardian = guardians[0];

    if (!guardian) {
      throw new NotFoundError();
    }

    const guardianForm = guardianUpdateSchema.parse(req.body);
    // console.log(guardianForm.photo_profile, "this form");

    const result = await updateGuardian(
      guardianForm.full_name,
      guardianForm.photo_profile,
      guardianForm.address,
      guardianForm.phone_number,
      guardianForm.emergency_number,
      guardianForm.occupation_id,
      userLoggedIn,
      guardianForm.relationship_id,
      guardian.guardian_id
    );

    return res.status(200).json({ messages: `update succes`, data: result });
  } catch (error) {
    next(error);
  }
}

////////// - STUDENT SECTION - //////////

export async function getAllStudentHandler (req, res, next) {
  try {
    const result = await getAllStudent()

    return res.status(200).json({data: result})
  } catch (error) {
    next(error)
  }
}

export async function getStudentProfileHandler(req, res, next) {
  try {
    const { id } = req.params;

    // console.log(id, guardian_id);
    const result = await getStudentProfile(id);

    if (!result) {
      throw new NotFoundError();
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getStudentNameHandler(req, res, next) {
  try {
    const { full_name } = req.query;
    const guardian = await getGuardianIdByUIDuser(req.user.id)
    
    const student = await getStudentName(full_name);
    if (!student) {
      throw new NotFoundError(`Student with name ${full_name} does not exist`);
    }
    console.log(student[0].guardian_id);
    

    const result = student.map((s) => {
      if (student[0].guardian_id === guardian[0].guardian_id) {
        return {
          full_name: s.full_name,
          photo_profile: s.photo_profile,
          address: s.address,
          birth_date: s.birth_date,
          nisn: s.nisn,
          class: s.class,
        };
      }
      return {
        full_name: s.full_name,
        photo_profile: s.photo_profile,
        class: s.class,
      };
    });

    return res.status(200).json({ data: result });
  } catch (error) {
    next();
  }
}

export async function newStudentHandler(req, res, next) {
  try {
    const user_id = req.user.id;

    let guardian_id;

    if (req.user.role === 3) {
      const guardian = await getGuardianIdByUIDuser(req.user.id);
      guardian_id = guardian[0].guardian_id;
    } else {
      guardian_id = req.body.guardian_id;
    }

    const studentForm = studentRegisterSchema.parse(req.body);

    const result = await newStudent(
      user_id,
      studentForm.class_id,
      studentForm.full_name,
      studentForm.photo_profile,
      studentForm.gender,
      studentForm.address,
      studentForm.birth_date,
      studentForm.nisn,
      guardian_id
    );

    const link = await newStudentGuardian(
      user_id,
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
    console.log(user_id,'<userid');

    console.log(student_id,'<studentid');
    

    const student = await getStudentById(student_id);
    // console.log(student);
    

    if (!student) {
      throw new NotFoundError();
    }
    const studentForm = studentUpdateSchema.parse(req.body);
    // console.log(studentForm);
    

    const result = await updateStudent(
      student_id,
      studentForm.class_id,
      studentForm.full_name,
      studentForm.photo_profile,
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

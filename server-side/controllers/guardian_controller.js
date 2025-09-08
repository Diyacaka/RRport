import { ZodError } from "zod";
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
  getStudentGuardian,
  getStudentProfile,
  getStudentName,
  newGuardian,
  newStudent,
  newStudentGuardian,
  updateGuardian,
  updateStudent,
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

export async function getStudentGuardianHandler(req, res, next) {
  try {
    const guardian = await getGuardianID(req.user.id);
    if (!guardian) {
      throw new NotFoundError();
    }
    // const {guardian_id} = await getGuardianIdByUIDuser(guardian)
    console.log(guardian);

    const rows = await getStudentGuardian(guardian.guardian_id);
    // console.log(rows);

    const wards = rows.map((temp) => ({
      id: temp.student_id,
      name: temp.student_name,
      photo: temp.student_photo,
      gender: temp.student_gender,
      address: temp.student_address,
      birthDate: temp.student_birtDate,
      nisn: temp.student_nisn,
      class: temp.student_calss,
      // relationship: temp.relationship
    }));

    return res.status(200).json({
      guardian: {
        id: guardian.guardian_id,
        name: guardian.full_name,
        photo: guardian.photo_profile || "",
        relationship: guardian.relations,
        address: guardian.address,
        phone: guardian.phone_number,
      },
      wards,
    });
  } catch (error) {
    next(error);
  }
}

export async function newGuardianHandler(req, res, next) {
  try {
    const { id: user_id, role: role_id } = req.user;
    if (req.user.isProfileComplete) {
      return res.status(400).json({
        message: "Profile already completed",
      });
    }
    const {
      full_name,
      photo_profile,
      relations,
      job,
      address,
      phone_number,
      emergency_number,
    } = guardianRegisterSchema.parse(req.body);

    const result = await newGuardian(
      user_id,
      full_name,
      photo_profile,
      role_id,
      relations,
      job,
      address,
      phone_number,
      emergency_number
    );

    return res.status(200).json({ messages: "register success", data: result });
  } catch (error) {
    throw error;
  }
}

export async function updateGuardianHandler(req, res, next) {
  try {
    const guardian = await getGuardianID(req.user.id);

    // console.log(guardian,'guardian');

    if (!guardian) {
      throw new NotFoundError();
    }

    const data = guardianUpdateSchema.parse(req.body);
    // console.log(data,'data');

    const result = await updateGuardian(
      data.full_name,
      data.relations,
      data.job,
      data.address,
      data.phone_number,
      data.emergency_number ?? "-",
      guardian.guardian_id
    );

    return res.status(200).json({ messages: `update succes`, data: result });
  } catch (error) {
    next(error);
  }
}

////////// - STUDENT SECTION - //////////

export async function getStudentProfileHandler(req, res, next) {
  try {
    const { id } = req.params;

    const { guardian_id } = await getGuardianID(req.user.id);

    // console.log(id, guardian_id);
    const result = await getStudentProfile(id, guardian_id);

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
    const { guardian_id } = await getGuardianID(req.user.id);
    console.log(guardian_id);
    

    const student = await getStudentName(full_name);
    if (!student) {
      throw new NotFoundError(`Student with name ${full_name} does not exist`);
    }

    const result = student.map((s) => {
      if (student.guardian_id === guardian_id) {
        return{
          full_name: s.full_name,
          photo_profile: s.photo_profile,
          address: s.address,
          birth_date: s.birth_date,
          nisn: s.nisn,
          class: s.class
        }
      }
      return {
        full_name: s.full_name,
        photo_profile: s.photo_profile,
        class: s.class
      }

    })

    return res.status(200).json({ data: result });
  } catch (error) {
    next();
  }
}

export async function newStudentHandler(req, res, next) {
  try {
    const guardian = await getGuardianIdByUIDuser(req.user.id);
    const { guardian_id } = guardian[0];

    const {
      full_name,
      photo_profile,
      gender,
      address,
      birth_date,
      nisn,
      classes,
      relationship,
    } = studentRegisterSchema.parse(req.body);

    const result = await newStudent(
      guardian_id,
      full_name,
      photo_profile,
      gender,
      address,
      birth_date,
      nisn,
      classes
    );

    const link = await newStudentGuardian(guardian_id, result.id, relationship);

    return res
      .status(200)
      .json({ message: `new student added`, data: result, link: link });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: `error validation` });
    }
    return next(error);
  }
}

export async function updateStudentHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { guardian_id } = await getGuardianID(req.user.id);
    console.log(id, "id");
    console.log(guardian_id, "guardianid");

    const student = await getStudentProfile(id, guardian_id);
    console.log(student, "studentporifle");

    if (!student) {
      throw new NotFoundError();
    }
    const { full_name, photo_profile, address, nisn, classes } =
      studentUpdateSchema.parse(req.body);
    const result = await updateStudent(
      id,
      full_name,
      photo_profile,
      address,
      nisn,
      classes
    );
    return res.status(200).json({
      messages: `Profile with id ${id} has been updated`,
      date: result,
    });
  } catch (error) {
    next(error);
  }
}

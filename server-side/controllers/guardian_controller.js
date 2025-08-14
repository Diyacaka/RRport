import { ZodError } from "zod";
import {
  guardianRegisterSchema,
  guardianUpdateSchema,
  studentRegisterSchema,
  studentUpdateSchema,
} from "../helpers/zod.js";
import {
  getGuardianID,
  getGuardianName,
  getStudentID,
  getStudentName,
  newGuardian,
  newStudent,
  newStudentGuardian,
  updateGuardian,
  updateStudent,
} from "../models/guardian_model.js";

////////// - GUARDIAN SECTION - //////////

export async function getGuardianIDHandler(req, res, next) {
  try {
    const { id } = req.params;
    console.log(id);

    const result = await getGuardianID(id);

    if (!result) {
      return res
        .status(404)
        .json({ messages: `id from guardian does not exist` });
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    throw error;
  }
}

export async function getGuardianNameHandler(req, res, next) {
  try {
    const { full_name } = req.query;

    const result = await getGuardianName(full_name);

    if (!result) {
      return res.status(404).json({ messages: `Cannot find Guardian` });
    }

    return res.status(201).json({ data: result });
  } catch (error) {
    throw error;
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
    const { id } = req.params;
    const guardian = await getGuardianID(id);

    console.log(guardian);

    if (!guardian) {
      return res
        .status(404)
        .json({ messages: "id from guardian does not exist" });
    }

    const data = guardianUpdateSchema.parse(req.body);
    const result = await updateGuardian(
      data.full_name,
      data.relations,
      data.job,
      data.address,
      data.phone_number,
      data.emergency_number ?? "-",
      id
    );

    return res.status(200).json({ messages: `update succes`, data: result });
  } catch (error) {
    throw error;
  }
}

////////// - STUDENT SECTION - //////////

export async function getStudentIDHandler(req, res, next) {
  try {
    const { id } = req.params;
    const result = await getStudentID(id);
    if (!result) {
      return res
        .status(404)
        .json({ messages: `Cannot find student with id ${id}` });
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    throw error;
  }
}

export async function getStudentNameHandler(req, res, next) {
  try {
    const { full_name } = req.query;

    const result = await getStudentName(full_name);
    if (!result) {
      res
        .status(404)
        .json({ messages: `Cannot find student with name ${full_name}` });
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    throw error;
  }
}

export async function newStudentHandler(req, res, next) {
  try {
    const guardian_id = req.user.id;
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

// export async function newStudentHandler(req, res, next) {
//   try {

//     const guardian_id = parseInt(req.params.id);
//     // console.log(guardian_id, 'controller');

//     const guardian = await getGuardianID(guardian_id);

//     const {
//       full_name,
//       photo_profile,
//       gender,
//       address,
//       birth_date,
//       nisn,
//       classes,

//     } = studentRegisterSchema.parse(req.body);
//     // console.log(req.body, `<<<<req.body`);

//     const result = await newStudent(
//       guardian,
//       full_name,
//       photo_profile,
//       gender,
//       address,
//       birth_date,
//       nisn,
//       classes,

//     );
//     return res
//       .status(200)
//       .json({ messages: "new student added", data: result });
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return res.status(400).json({
//         messages: `error validation`,
//         errors: error.errors,
//       });
//     }
//   }
// }

export async function updateStudentHandler(req, res, next) {
  try {
    const { id } = req.body;
    const student = await getStudentID(id);
    if (!student) {
      return res
        .status(404)
        .json({ messages: `Cannot find student with id${id}` });
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
    throw error;
  }
}

import {
  guardianRegisterSchema,
  guardianUpdateSchema,
} from "../../helpers/zod.js";

import { NotFoundError } from "../../helpers/enhanchedError.js";
import {
  getAllGuardian,
  getGuardianID,
  getGuardianName,
  newGuardian,
  updateGuardian,
} from "./guardian_model.js";

export async function getGuardianHandler(req, res, next) {
  try {
    const { id } = req.params;
    console.log(id);

    if (id) {
      const guardian = await getGuardianID(id);
      if (!guardian) {
        throw new NotFoundError();
      }
      return res.status(200).json({ data: guardian });
    }
  } catch (error) {
    next(error);
  }
}

export async function findListedGuardian(req, res, next) {
  try {
    const { full_name } = req.query;

    let result;

    if (full_name) {
      result = await getGuardianName(full_name);
      if (!result) {
        throw new NotFoundError(`Guardian With ${full_name} does not exist`);
      }
    } else result = await getAllGuardian();

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

    let photoUrl = null;
    if (req.file) {
      photoUrl = req.file.path;
    }

    const result = await newGuardian(
      user_id,
      guardianForm.full_name,
      photoUrl,
      guardianForm.address,
      guardianForm.phone_number,
      guardianForm.emergency_number,
      guardianForm.occupation_id
    );

    return res.status(200).json({
      messages: "Profile completion successul",
      data: result.rows[0].id,
    });
  } catch (error) {
    throw error;
  }
}

export async function updateGuardianHandler(req, res, next) {
  try {
    const { id } = req.user;
    // console.log(id, 'user');

    const guardian_param = req.params.id;
    // console.log(guardian_param, 'param');

    const guardians = await getGuardianID(guardian_param);
    console.log(guardians, 'model output');
    // const guardian = guardians[0];

    if (!guardians) {
      throw new NotFoundError("Guardian", guardian_param);
    }

    const guardianForm = guardianUpdateSchema.parse(req.body);
    // console.log(guardianForm.photo_profile, "this form");
    // console.log(req.body, 'body');

    let photoUrl = guardians.photo_profile;
    if (req.file) {
      photoUrl = req.file.path;
    }
    // console.log(photoUrl, 'photo');

    const result = await updateGuardian(
      guardianForm.full_name,
      photoUrl,
      guardianForm.address,
      guardianForm.phone_number,
      guardianForm.emergency_number,
      guardianForm.occupation_id,
      id,
      guardianForm.relationship_id,
      guardians.guardian_id
    );

    return res.status(200).json({ messages: `update succes`, data: result });
  } catch (error) {
    next(error);
  }
}

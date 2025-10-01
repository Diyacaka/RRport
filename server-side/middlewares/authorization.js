import { pool } from "../config/config.js";
import { ForbiddenError, NotFoundError } from "../helpers/enhanchedError.js";
import {
  getGuardianID,
  getStudentById,
  getStudentGuardianData,
} from "../models/guardian_model.js";

export async function authorizationTeacher(req, res, next) {
  try {
    const { role_id } = req.user;
    if (role_id !== 2) {
      return res
        .status(403)
        .json({ messages: `You do not have access into this page` });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export async function userAuthorization(req, res, next) {
  try {
    const { id } = req.user;
    const guardian_param = req.params.id;
    // console.log(id, 'auth');
    // console.log(guardian_param, 'auth');

    const guardian = await getGuardianID(guardian_param);
    // console.log(guardian,'auth');

    // console.log(typeof id, id);
    // console.log(typeof paramUserId, paramUserId);

    if (id !== guardian.user_id) {
      throw new ForbiddenError(`You can only edit your own profile`);
    }

    next();
  } catch (error) {
    throw error;
  }
}

export async function studentUpdateAuth(req, res, next) {
  try {
    // const { guardian_id } = await getGuardianID(req.user.id);
    // const { student_id } = req.params.student_id;
    const {guardian_id} = req.params
    const {student_id} = req.params
    console.log(guardian_id, 'guardian auth');
    console.log(student_id, 'guardian auth');
    

    const student = await getStudentById(student_id);
    if (!student) {
      throw new NotFoundError(`student with id ${student_id} does not exist`);
    }

    const result = await getStudentGuardianData(student_id, guardian_id);

    if (result.rowCount === 0) {
      return res.status(403).json({
        messages: `Acces Forbidden : You can only update your own ward`,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

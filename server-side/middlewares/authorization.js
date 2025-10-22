import { ForbiddenError, NotFoundError } from "../helpers/enhanchedError.js";
import { getGuardianID } from "../modules/guardian/guardian_model.js";
import {
  getStudentById,
  getStudentGuardianData,
} from "../modules/student/student_model.js";
import { getTeacherById } from "../modules/teacher/teacher_model.js";

export function authorizedRole(...allowedRole) {
  return (req, res, next) => {
    try {
      const { role } = req.user;

      if (!allowedRole.includes(role)) {
        throw new ForbiddenError(`You are not authorized`);
      }
      next()
    } catch (error) {
      next(error);
    }
  };
}

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

    let user_currently;

    if (req.user.role === 3) {
      const guardian = await getGuardianID(req.params.id);
      if (!guardian) {
        throw new NotFoundError("Guardian", guardian.guardian_id);
      }
      user_currently = guardian.user_id;
      // console.log(guardian, "query result auth");
    }

    if (req.user.role === 2) {
      const teacher = await getTeacherById(req.params.id);
      if (!teacher) {
        throw new NotFoundError("Teacher", teacher.id);
      }
      user_currently = teacher.user_id;
      // console.log(teacher,'teacher');
    }

    if (id !== user_currently) {
      throw new ForbiddenError(`You can only edit your own profile`);
    }

    next();
  } catch (error) {
    throw error;
  }
}

export async function studentUpdateAuth(req, res, next) {
  try {
    if (req.user.role === 2 || req.user.role === 1) return next();
    const { guardian_id } = req.params;
    const { student_id } = req.params;
    // console.log(guardian_id, "guardian_id auth");
    // console.log(student_id, "student_id auth");

    const student = await getStudentById(student_id);
    if (!student) {
      throw new NotFoundError(`student with id ${student_id} does not exist`);
    }
    // console.log(student, 'student query auth');

    const result = await getStudentGuardianData(student_id, guardian_id);
    console.log(result, "result query auth");

    let guardianId = Number(guardian_id);
    // console.log(typeof(guardianId), 'awal');
    // console.log(typeof(result[0].guardian_id));

    if (guardianId !== result[0].guardian_id) {
      throw new ForbiddenError("You can only edit your own ward");
    }
    // if (result.rowCount === 0) {
    //   return res.status(403).json({
    //     messages: `Acces Forbidden : You can only update your own ward`,
    //   });
    // }

    next();
  } catch (error) {
    next(error);
  }
}

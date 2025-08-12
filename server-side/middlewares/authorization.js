export async function authorizationTeacher(req, res, next) {
  try {
    const { role_id } = req.user;
    if (role_id !== 2) {
      return res
        .status(403)
        .json({ messages: `you do not have access into this page` });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export async function userAuthorization (req, res, next) {
  try {
    const tokenUserId = req.user.id
    const paramUserId = req.params.id
    if (tokenUserId !== paramUserId) {
      return res.status(403).json({messages: `Acces Forbidden: you can only update your own profile`})
    }

    next()
  } catch (error) {
    throw error
  }
}

export async function studentUpdateAuth (req, res, next) {
  try {
    const guardianId = req.user.id
    const paramStudentId = req.params.studentId
    const result = await pool.query(
      ` select * from student_guardian where guardian_id = $1 and student_id = $2
      `, [guardianId, paramStudentId]
    )
    if (result.rowCount === 0) {
      return res.status(403).json({messages: `Acces Forbidden : You can only update from your own ward`})
    }

    next()
  } catch (error) {
    throw error
  }
}

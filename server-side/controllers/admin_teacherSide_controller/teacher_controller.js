import { NotFoundError } from "../../helpers/enhanchedError.js";
import {
  newReportSchema,
  reportDetailSchema,
  teacherRegisterSchema,
  teacherUpdateSchema,
} from "../../helpers/zod.js";
import {
  addScore,
  addScoreBulk,
  // getReportById,
  getTeacherByUId,
  getTeacherByName,
  newReport,
  newTeacher,
  getTeacherSubjectByName,
  getTeacherById,
  getAllTeacher,
  updateTeacher,
  getAllReports,
  getStudentReport,
  getReportById,
} from "../../models/admin_techerSide_model/teacher_model.js";
import {
  getStudentById,
  // getStudentName,
  // getStudentProfile,
} from "../../models/guardian_model.js";
// getGuardianWardsByName

export async function getTeacherByid(req, res, next) {
  try {
    const { id } = req.query;

    const result = await getTeacherById(id);
    if (!result) {
      throw new NotFoundError(`Teacher with ${id} not found`);
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getAllTeacherHandler(req, res, next) {
  try {
    const result = await getAllTeacher();

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getTeacherByUIdHandler(req, res, next) {
  try {
    const { id } = req.query;
    const result = await getTeacherByUId(id);
    if (!result) {
      throw new NotFoundError(`Teacher with ${id} not found`);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getTeacherByNameHandler(req, res, next) {
  try {
    const { full_name } = req.query;

    const result = await getTeacherByName(full_name);

    if (!result) {
      throw new NotFoundError(`Teacher with ${full_name} not found`);
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getTeacherSubjectByNameHandler(req, res, next) {
  try {
    const { name, descriptions, subject_id } = req.query;

    let conditions = [];
    let params = [];

    if (name) {
      conditions.push(`s.name ilike $${params.length + 1}`);
      params.push(`%${name}%`);
    }

    if (descriptions) {
      conditions.push(`s.description ilike $${params.length + 1}`);
      params.push(`%${descriptions}%`);
    }

    if (subject_id) {
      conditions.push(`s.id = $${params.length + 1}`);
      params.push(subject_id);
    }

    const conditionString =
      conditions.length > 0 ? `where ${conditions.join(" and ")} ` : "";

    // console.log(conditionString, "controller");

    const teacherSubjects = await getTeacherSubjectByName(
      conditionString,
      params
    );
    console.log(params, "param di controller");
    console.log(name, subject_id, descriptions);

    // console.log(teacherSubjects, "<<<hasilnya");

    return res.json({ data: teacherSubjects });
  } catch (error) {
    next(error);
  }
}

export async function newTeacherHandler(req, res, next) {
  try {
    const { id: user_id } = req.user;

    if (req.user.isProfileComplete) {
      return res.status(400).json({
        messages: "Profile already completed",
      });
    }

    const teacher_form = teacherRegisterSchema.parse(req.body);

    const sub_role_id = Array.isArray(teacher_form.sub_role_id)
      ? teacher_form.sub_role_id
      : [teacher_form.sub_role_id];

    const subject_id = Array.isArray(teacher_form.subject_id)
      ? teacher_form.subject_id
      : [teacher_form.subject_id];

    console.log(teacher_form);

    const result = await newTeacher(
      user_id,
      teacher_form.full_name,
      teacher_form.nip,
      teacher_form.phone_number,
      teacher_form.emergency_number,
      teacher_form.address,
      teacher_form.photo_profile,
      sub_role_id,
      subject_id
    );

    return res.status(201).json({ messages: `register success`, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateTeacherHandler(req, res, next) {
  try {
    const user_id = req.user.id;
    // console.log(user_id, "userid");

    const { teacher_id } = req.query;
    // console.log(teacher_id, "teacher_id");

    const find_teacher = await getTeacherById(teacher_id);
    if (!find_teacher) {
      throw new NotFoundError(`Teacher with ${teacher_id} not found`);
    }

    const teacher_form = teacherUpdateSchema.parse(req.body);

    const result = await updateTeacher(
      teacher_form.full_name,
      teacher_form.nip,
      teacher_form.phone_number,
      teacher_form.emergency_number,
      teacher_form.address,
      teacher_form.photo_profile,
      user_id,
      teacher_id,
      teacher_form.sub_role_id,
      teacher_form.subject_id
    );

    return res.status(200).json({
      messages: `update succesfull teacher${teacher_id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

///// TEAHCER/REPORT SECTION /////

export async function getAllReportsHandler (req, res, next) {
  try {
    const result = await getAllReports()

    return res.status(200).json({data:result})
  } catch (error) {
    next(error)
  }
}

export async function getStudentReportHandler (req, res, next) {
  try {
    const {id} = req.query

    const result = await getStudentReport(id)

    return res.status(200).json({data: result})
  } catch (error) {
    next(error)
  }
}

export async function newReportHandler(req, res, next) {
  try {
    const teacher = await getTeacherByUId(req.user.id);
    const student = await getStudentById(req.query.student_id);

    const report = await newReportSchema.parse(req.body);

    const result = await newReport(
      student.id,
      student.class_id,
      teacher.id,
      report.semester,
      report.academic_year,
      report.remarks,
      teacher.id
    );

    return res
      .status(200)
      .json({ messages: "new blank report added", data: result });
  } catch (error) {
    next(error);
  }
}

export async function addScoreHandler(req, res, next) {
  try {
    const { id: report_id } = req.params;
    const { subject_id, score } = req.body;

    const result = await addScore(report_id, subject_id, score);

    return res.status(200).json({ messages: "score", data: result });
  } catch (error) {
    next(error);
  }
}

export async function addScoreBulkHandler(req, res, next) {
  try {
    const { id } = req.params;

    const report = await getReportById(id)
    if (!report) {
      throw new NotFoundError(`report with ${id} not found`)
    }

    const scoreSchema = reportDetailSchema.parse(req.body);
    // console.log(report_id);
    // console.log(req.body);

    const value = [];
    const temp = [];

    scoreSchema.score.forEach((s, i) => {
      const index = i * 3;
      value.push(Number(report.id), s.subject_id, s.score);
      temp.push(`($${index + 1},${index + 2},${index + 3})`);
    });

    const result = await addScoreBulk(temp, value);

    return res.status(200).json({ messages: "score added", data: result });
  } catch (error) {
    next(error);
  }
}

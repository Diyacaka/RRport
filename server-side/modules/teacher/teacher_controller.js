import { NotFoundError } from "../../helpers/enhanchedError.js";
import {
  teacherRegisterSchema,
  teacherUpdateSchema,
} from "../../helpers/zod.js";
// import { getStudentById } from "../../universal/guardian_model.js";

import {
  getAllTeacher,
  getTeacherById,
  getTeacherByName,
  getTeacherBySubject,
  getTeacherBySubjectName,
  newTeacher,
  updateTeacher,
} from "./teacher_model.js";

export async function getTeacherByid(req, res, next) {
  try {
    const { id } = req.params;

    const result = await getTeacherById(id);
    if (!result) {
      throw new NotFoundError(`Teacher`, id);
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function findListedTeacher(req, res, next) {
  try {
    const { full_name, subject_id, subject_name } = req.query;
    console.log(req.query);

    let teachers;
    const num_subject_id = Number(subject_id);

    if (full_name) {
      teachers = await getTeacherByName(full_name);
      console.log(teachers, "full name");
      if (!teachers.length) {
        throw new NotFoundError(`Teacher`, full_name);
      }
    } else if (subject_name) {
      teachers = await getTeacherBySubjectName(subject_name);
      console.log(teachers, "subject name");
      if (!teachers.length) {
        throw new NotFoundError(`Teacher`, subject_name);
      }
    } else if (num_subject_id) {
      teachers = await getTeacherBySubject(num_subject_id);
      console.log(teachers, "subId");
      if (!teachers.length) {
        throw new NotFoundError(`Teacher`, num_subject_id);
      }
    } else {
      teachers = await getAllTeacher();
    }

    return res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
}

export async function newTeacherHandler(req, res, next) {
  try {
    const { id: user_id } = req.user;

    // const parser = (val) => {
    //   if (!val) return []
    //   if (Array.isArray(val)) return val.map((s)=>Number(v))
    //   if (typeof val === "string") return [Number(val)]
    //   return []
    // }

    // const formatBody = {
    //   ...req.body,
    //   sub_role_id: parser(body.sub_role_id),
    //   sub_role_id: parser(body.sub_role_id)
    // }
    // console.log(req.body);

    if (req.user.isProfileComplete) {
      return res.status(400).json({
        messages: "Profile already completed",
      });
    }

    const teacher_form = teacherRegisterSchema.parse(req.body);

    // const sub_role_id = Array.isArray(teacher_form.sub_role_id)
    //   ? teacher_form.sub_role_id
    //   : [teacher_form.sub_role_id];

    // const subject_id = Array.isArray(teacher_form.subject_id)
    //   ? teacher_form.subject_id
    //   : [teacher_form.subject_id];

    console.log(teacher_form);

    let photoUrl;
    if (req.file) {
      photoUrl = req.file.path;
    }

    const result = await newTeacher(
      user_id,
      teacher_form.full_name,
      teacher_form.nip,
      teacher_form.phone_number,
      teacher_form.emergency_number,
      teacher_form.address,
      photoUrl,
      teacher_form.sub_role_id,
      teacher_form.subject_id
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

    // const { id } = req.params;
    // console.log(req.params, "teacher_id");

    const teacher = await getTeacherById(req.params.id);
    if (!teacher) {
      throw new NotFoundError("Techer", teacher.id);
    }
    console.log(req.body, "body");

    const teacher_form = teacherUpdateSchema.parse(req.body);

    // console.log(teacher_form, 'teacher form');
    let photoUrl;
    if (req.file) {
      photoUrl = req.file.path;
    }

    const result = await updateTeacher(
      teacher_form.full_name,
      teacher_form.nip,
      teacher_form.phone_number,
      teacher_form.emergency_number,
      teacher_form.address,
      photoUrl,
      user_id,
      teacher.id,
      teacher_form.sub_role_id,
      teacher_form.subject_id
    );

    return res.status(200).json({
      messages: `update succesfull teacher${teacher.id}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

import { pool } from "../../config/config.js";
import { NotFoundError } from "../../helpers/enhanchedError.js";

export async function getTeacherById(id) {
  try {
    const res = await pool.query(
      `
      select id, user_id, full_name, photo_profile from teachers where id = $1
      `,
      [id]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getAllTeacher() {
  try {
    const res = await pool.query(
      `
      select id, full_name, photo_profile, nip from teachers
      `
    );

    return res.rows;
  } catch (error) {
    throw error;
  }
}

export async function getTeacherByUId(id) {
  try {
    const res = await pool.query(
      `
      select id, user_id, full_name, photo_profile from teachers where user_id = $1
      `,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getTeacherByName(full_name) {
  try {
    const res = await pool.query(
      `
      select full_name from teachers where full_name ILIKE $1
      `,
      [`%${full_name}%`]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getTeacherBySubject(id) {
  try {
    const res = await pool.query(
      `
      select 
      t.id as teacher_id, t.nip as teacher_nip, t.photo_profile as teacher_photo_profile,
      s.id as subject_id, s.name as subject_name, s.description as subject_description
      from teachers t
      join teacher_subjects ts on t.id = ts.teacher_id
      join subjects s on s.id = ts.subject_id
      where subject_id = $1
      `,
      [id]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getTeacherSubjectByName(conditions = "", params = []) {
  try {
    const res = await pool.query(
      `
      with filtered_subjects as (
      select s.id, s.name, s.description from subjects s
      ${conditions}
      )
      select
      t.id as teacher_id,
      t.full_name as teacher_full_name,
      t.nip as teacher_nip,
      t.photo_profile as teacher_photo_profile,
        coalesce(
          json_agg(
            json_build_object(
              'subject_id', fs.id,
              'subject_name', fs.name,
              'subject_description', fs.description
            )
          )filter (where fs.id is not null),
           '[]' :: json
        )as subjects
      from teachers t
      join teacher_subjects ts on t.id = ts.teacher_id
      join filtered_subjects fs on fs.id = ts.subject_id
      group by t.id, t.full_name, t.nip, t.photo_profile
      having count (fs.id) > 0
      `,
      params
    );
    // console.log(conditions, 'model');
    // console.log(params, 'model');

    return res.rows;
  } catch (error) {
    throw error;
  }
}

export async function newTeacher(
  user_id,
  full_name,
  nip,
  phone_number,
  emergency_number,
  address,
  photo_profile,
  sub_role_id,
  subject_id
) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const res = await client.query(
      `insert into teachers (user_id, full_name, nip, phone_number, emergency_number, address, photo_profile)
            values ($1, $2, $3, $4, $5, $6, $7) returning id
            `,
      [
        user_id,
        full_name,
        nip,
        phone_number,
        emergency_number,
        address,
        photo_profile,
      ]
    );

    const teacher_id = res.rows[0].id;

    for (const srId of sub_role_id) {
      await client.query(
        `
        insert into teacher_sub_roles (teacher_id, sub_role_id)
        values ($1, $2)`,
        [teacher_id, srId]
      );
    }

    for (const subjId of subject_id) {
      await client.query(
        `
        insert into teacher_subjects (teacher_id, subject_id, created_by)
        values ($1, $2, $3)`,
        [teacher_id, subjId, user_id]
      );
    }

    await client.query(
      `update users set is_profile_complete = true where id = $1`,
      [user_id]
    );

    await client.query("COMMIT");

    return res.rows[0];
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    throw error;
  } finally {
    if (client) client.release();
  }
}

export async function updateTeacher(
  full_name,
  nip,
  phone_number,
  emergency_number,
  address,
  photo_profile,
  updated_by,
  teacher_id,
  sub_role_id,
  subject_id
) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN");

    const res = await client.query(
      `
      update teachers
      set full_name = $1, nip = $2, phone_number = $3, emergency_number = $4, address = $5, photo_profile = $6, updated_by = $7, updated_at = now() where id = $8
      `,
      [
        full_name,
        nip,
        phone_number,
        emergency_number,
        address,
        photo_profile,
        updated_by,
        teacher_id,
      ]
    );
    await client.query(
      `
      update teacher_sub_roles 
      set sub_role_id = $1, updated_by = $2, updated_at = now() where teacher_id = $3
      `,
      [sub_role_id, updated_by, teacher_id]
    );
    await client.query(
      `
      update teacher_subjects
      set subject_id = $1, updated_by = $2, updated_at = now() where teacher_id = $3
      `,
      [subject_id, updated_by, teacher_id]
    );

    await client.query("COMMIT");

    return res.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    if (client) client.release();
  }
}

///// REPORTS/TEACHER SIDE /////

export async function getAllReports() {
  try {
    const res = await pool.query(
      `
      select
      r.id as report_id,
      s.id as student_id,
      s.full_name as student_full_name,
      s.gender,
      s.photo_profile,
      c.id as class_id,
      c.grade_level,
      r.semester,
      r.academic_year
      from reports r
      join students s on r.student_id = s.id
      join classes c on r.class_id = c.id
      order by r.academic_year desc, r.semester desc, c.grade_level, s.full_name
      `
    );
    // limit : limit offset :offset

    return res.rows;
  } catch (error) {
    throw error;
  }
}

export async function getStudentReport(id) {
  try {
    const res = await pool.query(
      `
      select 
      r.id as report_id,
      r.semester,
      r.academic_year,
      r.release_date,
      r.remarks,

      json_build_object(
        'id', s.id,
        'full_name', s.full_name,
        'gender', s.gender,
        'nisn', s.nisn,
        'photo_profile', s.photo_profile
        ) as student,
      
      json_build_object(
        'class_name', c.class_name,
        'academic_year', c.academic_year,
        'grade_level', c.grade_level,
        'homeroom_teacher', json_build_object(
          'id', t.id,
          'name', t.full_name
        )
      ) as class,

      coalesce(
        json_agg(
          json_build_object(
            'id', subj.id,
            'name', subj.name,
            'score', rd.score
          )
        ) filter(where rd.id is not null),'[]'
      )as subjects


      from reports r 
      join students s on r.student_id = s.id
      join classes c on r.class_id = c.id
      left join teachers t on c.homerom_teacher_id = t.id
      left join report_details   rd on r.id = rd.report_id
      left join subjects subj on rd.subject_id = subj.id
      where r.id = $1
      group by r.id, s.id, c.id, t.id
      `,
      [id]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getReportById(id) {
  try {
    const res = await pool.query(
      `
      select id, student_id, class_id, teacher_id, semester, academic_year from reports where id = $1
      `,
      [1]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function newReport(
  student_id,
  class_id,
  teacher_id,
  semester,
  academic_year,
  remarks,
  created_by
) {
  try {
    const res = await pool.query(
      `
      insert into reports (student_id, class_id, teacher_id, semester, academic_year, remarks, created_by)
      values ($1, $2, $3, $4, $5, $6, $7) returning id
      `,
      [
        student_id,
        class_id,
        teacher_id,
        semester,
        academic_year,
        remarks,
        created_by,
      ]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function addScore(report_id, subject_id, score) {
  try {
    const res = await pool.query(
      `
      insert into report_details (report_id, subject_id, score )
      values ($1, $2, $3) returning *
      `,
      [report_id, subject_id, score]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function addScoreBulk(temp, values) {
  try {
    // const values = []
    // const temp = []

    // scores.forEach((s,i) => {
    //   const index = i * 3
    //   values.push(report_id, s.subject_id, s.score)
    //   temp.push(`($${index+1}, $${index+2}, $${index+3})`)
    // });

    const res = await pool.query(
      `
      insert into report_details (report_id, subject_id, score)
      values ${temp.join(", ")} returning *
      `,
      values
    );

    return res.rows;
  } catch (error) {
    throw error;
  }
}

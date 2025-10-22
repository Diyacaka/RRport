import { pool } from "../../config/config.js";

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

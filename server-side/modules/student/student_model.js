import { pool } from "../../config/config.js";

export async function getAllStudent() {
  try {
    const res = await pool.query(`
      select 
      s.id, s.class_id, s.full_name, s.photo_profile, s.gender, s.birth_date, s.nisn,
      c.class_name, c.grade_level, c.description
      from students s
      left join classes c on s.class_id = c.id
      `);

    return res.rows;
  } catch (error) {
    throw error;
  }
}

export async function getStudentById(id) {
  try {
    const res = await pool.query(
      `
      select 
      s.id, s.class_id, s.full_name, s.photo_profile , s.gender, s.birth_date, s.nisn,
      c.class_name, c.grade_level, c.description,
      coalesce(
        json_agg(
          json_build_object(
          'raport_id', r.id,
          'semester', r.semester
          )
        ),'[]'
      ) as reports
      from students s
      join classes c on s.class_id = c.id
      left join reports r on r.student_id = s.id
      where s.id = $1 and s.is_deleted is false
      group by s.id, c.class_name, c.grade_level, c.description
      `,
      [id]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getStudentName(full_name) {
  try {
    const res = await pool.query(
      `select 
      s.id, s.guardian_id, s.full_name, s.photo_profile, s.gender, s.address, s.birth_date, s.nisn,
      c.class_name, c.grade_level, c.description
      from students s
      left join classes c on s.class_id = c.id
      where s.full_name ILIKE $1 and s.is_deleted = false`,
      [`%${full_name}%`]
    );
    return res.rows;
  } catch (error) {
    throw error;
  }
}

export async function newStudent(
  guardian_id,
  class_id,
  full_name,
  photo_profile,
  gender,
  address,
  birth_date,
  nisn,
  created_by
) {
  try {
    const res = await pool.query(
      `
      insert into students (guardian_id, class_id, full_name, photo_profile, gender, address, birth_date, nisn, created_by)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id
      `,
      [
        guardian_id,
        class_id,
        full_name,
        photo_profile,
        gender,
        address,
        birth_date,
        nisn,
        created_by,
      ]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function newStudentGuardian(
  guardian_id,
  student_id,
  relationship_id
) {
  const client = await pool.connect();
  try {
    const res = await pool.query(
      `
      insert into student_guardian (guardian_id, students_id, relationship_id) 
      values ($1,$2,$3) returning *
      `,
      [guardian_id, student_id, relationship_id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function updateStudent(
  id,
  class_id,
  full_name,
  photo_profile,
  address,
  nisn,
  updated_by
) {
  try {
    const res = await pool.query(
      `update students 
      set class_id=$1, full_name=$2, photo_profile=$3, address=$4, nisn=$5, updated_by=$6, updated_at=now() where id=$7 and is_deleted=false returning id`,
      [class_id, full_name, photo_profile, address, nisn, updated_by, id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getStudentGuardianData(student_id, guardian_id) {
  try {
    const res = await pool.query(
      `
      select * from student_guardian where students_id = $1 and guardian_id = $2
      `,
      [student_id, guardian_id]
    );

    return res.rows;
  } catch (error) {
    throw error;
  }
}

import { pool } from "../../config/config.js";

export async function getTeacherById(id) {
  try {
    const res = await pool.query(
      `
      select id, user_id, full_name, photo_profile, nip, emergency_number
      from teachers
      where (id = $1 or user_id = $1)
      and is_deleted = false
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
      select id, user_id, full_name, photo_profile, nip from teachers
      `
    );

    return res.rows;
  } catch (error) {
    throw error;
  }
}

export async function getTeacherByName(full_name) {
  try {
    const res = await pool.query(
      `
      select id, user_id, full_name, photo_profile, nip, emergency_number
      from teachers
      where full_name ILIKE $1
      and is_deleted = false
      `,
      [`%${full_name}%`]
    );
    return res.rows;
  } catch (error) {
    throw error;
  }
}

export async function getTeacherBySubject(subject_id) {
  try {
    const res = await pool.query(
      `
      select 
      t.id as teacher_id, t.nip, t.photo_profile, t.full_name, t.emergency_number,
      s.id as subject_id, s.name as subject_name, s.description
      from teachers t
      join teacher_subjects ts on t.id = ts.teacher_id
      join subjects s on s.id = ts.subject_id
      where s.id = $1
      and t.is_deleted = false
      `,
      [subject_id]
    );

    return res.rows;
  } catch (error) {
    throw error;
  }
}

export async function getTeacherBySubjectName(subject_name) {
  try {
    const res = await pool.query(
      `
      select 
      t.id as teacher_id, t.nip, t.photo_profile, t.full_name, t.emergency_number,
      s.id as subject_id, s.name as subject_name, s.description
      from teachers t
      join teacher_subjects ts on t.id = ts.teacher_id
      join subjects s on s.id = ts.subject_id
      where s.name ILIKE $1
      and t.is_deleted = false
      `,
      [subject_name]
    );

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

    if (sub_role_id && sub_role_id.length > 0) {
      await client.query(
        `delete from teacher_sub_roles where teacher_id = $1`,
        [teacher_id]
      );
      for (const sub_role of sub_role_id) {
        await client.query(
          `
          insert into teacher_sub_roles (teacher_id, sub_role_id, updated_by)
          values ($1, $2, $3)
          `,
          [teacher_id, sub_role, updated_by]
        );
      }
    }

    if (subject_id && subject_id.length > 0) {
      await client.query(`delete from teacher_subjects where teacher_id = $1`, [
        teacher_id,
      ]);
      for (const teacher_subj of subject_id) {
        await client.query(
          `
          insert into teacher_subjects (teacher_id, subject_id, updated_by)
          values ($1, $2, $3)
        `,
          [teacher_id, teacher_subj, update]
        );
      }
    }

    await client.query("COMMIT");

    return res.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    if (client) client.release();
  }
}


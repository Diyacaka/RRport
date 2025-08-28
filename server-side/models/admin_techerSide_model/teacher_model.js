import { pool } from "../../config/config.js";

export async function getTeacherById (id) {
  try {
    const res = await pool.query(`
      select full_name, role, nip, sub_role, subject from teachers where id = $1
      `,[id])
      return res.rows[0]
  } catch (error) {
    throw error
  }
}

export async function getTeacherByName (name) {
  try {
    const res = await pool.query(`
      select full_name, role, sub_role, nip, subject, phone_number, photo_profile from teachers where name = $1
      `, [name])
      return res.rows[0]
  } catch (error) {
    throw error
  }
}

export async function getGuardianWardsByName (guardianName) {
  try {
    const res = await pool.query(`
      select 
      g.id as guardian_id, g.full_name as guardian_name, g.photo_profile as guardian_photo, g.address as guardian_address, g.phone_number as guardian_phone_number,
      s.id as student_id, s.full_name as student_name, s.photo_profile as student_photo, s.gender as student_gender, s.address as student_address, s.birth_date as student_birthdate, s.nisn as student_nisn, s.class as student_class,
      r.name as relationship
      from guardian g
      join student_guardian sg on g.id = sg.guardian_id
      join students s on s.id = sg.students_id
      join relationship r on r.id = sg.relationship_id
      where g.full_name ilike $1
      `,[`%${guardianName}%`])

      return res.rows
  } catch (error) {
    throw error
  }
}

export async function newTeacher(
  user_id,
  full_name,
  role_id,
  sub_role,
  nip,
  subject,
  phone_number,
  address,
  photo_profile
) {
  try {
    const res = await pool.query(
      `insert into teachers (user_id, full_name, role, sub_role, nip, subject, phone_number, address,photo_profile)
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id
            `,
      [
        user_id,
        full_name,
        role_id,
        sub_role,
        nip,
        subject,
        phone_number,
        address,
        photo_profile,
      ]
    );

    await pool.query(
      `update users set is_profile_complete = true where id = $1`,
      [user_id]
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateTeacher(
  full_name,
  nip,
  subject,
  phone_number,
  address,
  photo_profile,
  id
) {
  try {
    const res = await pool.query(
      `update teachers set full_name=$1, nip=$2, subject=$3, phone_number=$4, address=$5, photo_profile=$6, updated_at=now() where id =$7 and is_deleted = false
        `,
      [full_name, nip, subject, phone_number, address, photo_profile, id]
    );
    return res.rowCount;
  } catch (error) {
    throw error;
  }
}

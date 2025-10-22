import { pool } from "../../config/config.js";

export async function getAllGuardian() {
  try {
    const res = await pool.query(
      `
        select g.id as guardian_id, g.full_name, g.photo_profile,
        o.name
        from guardian g
        left join occupation o on g.occupation_id = o.id
        where g.is_deleted = false
        `
    );

    return res.rows;
  } catch (error) {
    throw error;
  }
}

export async function getGuardianID(id) {
  try {
    const res = await pool.query(
      `select 
      g.id as guardian_id, g.user_id, g.full_name, g.photo_profile, g.address, g.phone_number,
      o.name as occupation_name,
      json_agg(
        json_build_object(
        'student_id', s.id,
        'student_name', s.full_name,
        'relationship_name', r.name 
        )
      )as wards
      from guardian g
      left join student_guardian sg on sg.guardian_id = g.id
      left join relationship r on sg.relationship_id = r.id
      left join students s on sg.students_id = s.id
      left join occupation o on g.occupation_id = o.id
      where (g.id = $1 or g.user_id = $1)
      and g.is_deleted = false
      group by g.id, g.user_id, g.full_name, g.photo_profile, g.address, g.phone_number, o.name
      `,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getGuardianName(full_name) {
  try {
    const res = await pool.query(
      `select 
      g.id, g.full_name, g.phone_number, g.photo_profile, g.address,
      o.name as occupation_name,
      json_agg(
        json_build_object(
        'student_id', s.id,
        'student_name', s.full_name,
        'relationship_name', r.name
        )
      ) as wards
      from guardian g
      left join student_guardian sg on sg.guardian_id = g.id
      left join students s on sg.students_id = s.id
      left join relationship r on sg.relationship_id = r.id
      left join occupation o on o.id = g.occupation_id
      where g.full_name ILIKE $1 and g.is_deleted = false
      group by g.id, g.full_name, g.phone_number, g.photo_profile, g.address, o.name  
      `,
      [`%${full_name}%`]
    );

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function newGuardian(
  user_id,
  full_name,
  photo_profile,
  address,
  phone_number,
  emergency_number,
  occupation_id
) {
  try {
    const res = await pool.query(
      `insert into guardian (user_id, full_name, photo_profile, address, phone_number, emergency_number, occupation_id)
            values ($1,$2,$3,$4,$5,$6,$7) returning id`,
      [
        user_id,
        full_name,
        photo_profile,
        address,
        phone_number,
        emergency_number,
        occupation_id,
      ]
    );

    await pool.query(
      `update users set is_profile_complete = true where id=$1`,
      [user_id]
    );

    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateGuardian(
  full_name,
  photo_profile,
  address,
  phone_number,
  emergency_number,
  occupation_id,
  user_id,
  relationship_id,
  id
) {
  try {
    const res = await pool.query(
      `update guardian set full_name=$1, photo_profile=$2, address=$3, phone_number=$4, emergency_number=$5, occupation_id=$6, updated_by=$7, updated_at=now() where id=$8 and is_deleted=false`,
      [
        full_name,
        photo_profile,
        address,
        phone_number,
        emergency_number,
        occupation_id,
        user_id,
        id,
      ]
    );

    await pool.query(
      `update student_guardian set relationship_id=$1 where guardian_id=$2`,
      [relationship_id, id]
    );

    return res.rowCount;
  } catch (error) {
    throw error;
  }
}

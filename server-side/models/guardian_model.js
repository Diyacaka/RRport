import { pool } from "../config/config.js";

export async function getGuardianID(id) {
  try {
    const res = await pool.query(
      `select full_name, relations,job, address,phone_number from guardian where id = $1 and is_deleted = false`,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getGuardian(full_name) {
  try {
    const res = await pool.query(
      `select full_name,relations,job,address,phone_number from guardian where full_name ILIKE $1`,
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
  role_id,
  relations,
  job,
  address,
  phone_number,
  emergency_number
) {
  try {
    // const {id, role} = req.user
    const res = await pool.query(
      `insert into guardian (user_id, full_name,photo_profile, role, relations, job, address, phone_number, emergency_number)
            values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`,
      [
        user_id,
        full_name,
        photo_profile,
        role_id,
        relations,
        job,
        address,
        phone_number,
        emergency_number,
      ]
    );

    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateGuardian(
  full_name,
  relations,
  job,
  address,
  phone_number,
  emergency_number,
  id
) {
  try {
    const res = await pool.query(
      `update guardian set full_name = $1, relations=$2, job=$3, address=$4, phone_number=$5, emergency_number=$6, updated_at=now() where id=$7 and is_deleted=false`,
      [full_name, relations, job, address, phone_number, emergency_number, id]
    );

    return res.rowCount;
  } catch (error) {
    throw error;
  }
}

export async function softDeleteGuardian(id) {
  try {
    const res = await pool.query(
      `update guardian set is_deleted=true, deleted_at=now() where id = $1`,
      [id]
    );
    return res.rowCount;
  } catch (error) {
    throw error;
  }
}

export async function newStudent(
  user_id,
  full_name,
  role_id,
  photo_profile,
  nisn,
  classes
) {
  try {
    const res = await pool.query(
      `insert into students (user_id, full_name,role_id, photo_profile, nisn, class returning id)
      values($1,$2,$3,$4,$5,$6)`,
      [user_id, full_name, role_id, photo_profile, nisn, classes]
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getStudentName(full_name) {
  try {
    const res = await pool.query(
      `select full_name, photo_profile, nisn, class from student where full_name ILIKE $1`,
      [`%${full_name}%`]
    );
    return res.rows;
  } catch (error) {
    throw error;
  }
}

import { pool } from "../config/config.js";

////////// - GUARDIAN SECTION - //////////

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

    await pool.query(
      `update users set is_profile_complete = true where id=$1`,
      [user_id]
    );
    // await pool.query("commit");
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

////////// - STUDENT SECTION - //////////

export async function getStudentID(id) {
  try {
    const res = await pool.query(
      `
      select full_name, photo_profile, nisn, class from students where id=$1 and is_deleted = false`,
      [id]
    );
    return res.rows[0]
  } catch (error) {
    throw error;
  }
}

export async function getStudentName(full_name) {
  try {
    const res = await pool.query(
      `select full_name, photo_profile, nisn, class from students where full_name ILIKE $1 and is_deleted = false`,
      [`%${full_name}%`]
    );
    return res.rows[0]
  } catch (error) {
    throw error;
  }
}

export async function newStudent(
  guardian_id,
  full_name,

  photo_profile,
  gender,
  address,
  birth_date,
  nisn,
  classes
) {
  try {
    const role_id = 4;
    const res = await pool.query(
      `insert into students (guardian_id, full_name,role, photo_profile, gender, address, birth_date, nisn, class)
      values($1,$2,$3,$4,$5,$6, $7,$8,$9)  returning id`,
      [
        guardian_id,
        full_name,
        role_id,
        photo_profile,
        gender,
        address,
        birth_date,
        nisn,
        classes,
      ]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function updateStudent(
  id,
  full_name,
  photo_profile,
  address,
  nisn,
  classes
) {
  try {
    const res = await pool.query(
      `update students set full_name=$1, photo_profile=$2, address=$3, nisn=$4, class=$5, updated_at=now() where id=$6 and is_deleted=false  returning id`,
      [full_name, photo_profile, address, nisn, classes, id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function softDeleteStudent(id) {
  try {
    const res = await pool.query(
      `update student set is_deleted=true, deleted_at=now() where id=$1 `,
      [id]
    );
    return res;
  } catch (error) {
    throw error;
  }
}

import { pool } from "../../config/config.js";

///// ADMIN CRUD ZONE /////

export async function getAdminId(id) {
  try {
    const res = await pool.query(
      `
      select a.full, a.phone_number, a.photo_profile, r.name as role from admins a left join a on.role_id = r.id where a.id = $1
      `,
      [1]
    );
  } catch (error) {
    throw error;
  }
}

export async function getTeacherId(id) {
  try {
    const res = await pool.query(
      `
            select t.full_name, t.nip, t.subject, t.photo_profile, t.sub_role, r.name as role from teachers t left join roles on t.role_id = r.id where t.id = $1
            `,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getGuardianId(id) {
  try {
    const res = await pool.query(
      `
            select * from guardian where id = $1
            `,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getStudentId(id) {
  try {
    const res = await pool.query(
      `
            select * from students where id = $1
            `,
      [id]
    );
  } catch (error) {
    throw error;
  }
}

export async function newAdmins(
  user_id,
  full_name,
  role_id,
  phone_number,
  emergency_number,
  address,
  photo_profile
) {
  try {
    const res = await pool.query(
      `
            insert into admins (user_id, full_name, role, phone_number, emergency_number, address, photo_profile)
            values ($1, $2, $3, $4, $5, $6)
            `,
      [
        user_id,
        full_name,
        role_id,
        phone_number,
        emergency_number,
        address,
        photo_profile,
      ]
    );

    await pool.query(
      `
                update admins set is_profile_completed = true where id = $1
                `,
      [user_id]
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateAdmins(
  full_name,
  phone_number,
  emergency_number,
  address,
  photo_profile,
  id
) {
  try {
    const res = await pool.query(
      `
            update admins set full_name = $1, phone_number = $2, emergency_number = $3, address = $4, photo_profile = $5, updated_at = now() 
            where id = $6
            `,
      [full_name, phone_number, emergency_number, address, photo_profile, id]
    );
    return res;
  } catch (error) {}
}

///// ADMIN DANGER ZONE /////
export async function softDeleteGuardian(id) {
  try {
    const res = await pool.query(
      `
            update guardian set is_deleted = true, deleted_at = now() where id = $1
            `,
      [id]
    );
    return res.rowCount;
  } catch (error) {
    throw error;
  }
}

export async function softRestoreGuardian(id) {
  try {
    const res = await pool.query(
      `
            update guardian set is_deleted = false, restored_at= now() where id = $1 and is_deleted = true
            `,
      [id]
    );
    return res.rowCount;
  } catch (error) {
    throw error;
  }
}

export async function softDeleteStudent(id) {
  try {
    const res = await pool.query(
      `
            update students set is_deleted = true, deleted_at = now() where id = $1
            `,
      [id]
    );
    return res.rowCount;
  } catch (error) {
    throw error;
  }
}

export async function softRestoreStudent(id) {
  try {
    const res = await pool.query(
      `
            update students set is_deleted = false, restored_at = now() where id = $1 and is_deleted = true
            `,
      [id]
    );
    return res.rowCount;
  } catch (error) {
    throw error;
  }
}

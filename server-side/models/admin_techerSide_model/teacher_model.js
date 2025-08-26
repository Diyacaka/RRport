import { pool } from "../../config/config.js";

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

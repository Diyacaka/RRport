import { pool } from "../config/config.js";

export const getUserEmail = async (email) => {
  try {
    const res = await pool.query(`select * from users where email = $1`, [
      email,
    ]);

    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

export const newUSer = async (email, password, selected_role) => {
  try {
    if (selected_role == 1) {
      return { messages: `you cannot pick this role` };
    }
    const role_id = email.toLowerCase().includes("guru") ? 2 : selected_role;

    const res = await pool.query(
      `insert into users (email, password, role_id, is_profile_complete)
            values ($1,$2,$3,false) returning id
            `,
      [email, password, role_id]
    );
    // console.log(res.rows, 'ini res model')
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

export const markProfileCompleted = async (id) => {
  try {
    const res = await pool.query(`update users set is_profile_complete = true where id=$1 returning id`, [id])
    return res.rows[0]
  } catch (error) {
    throw error
  }
}
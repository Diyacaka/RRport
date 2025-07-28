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
    const role_id = email.toLowerCase().includes("guru") ? 1 : selected_role;
    const res = await pool.query(
      `insert into users (email, password, role_id)
            values ($1,$2,$3) returning id
            `,
      [email, password, role_id]
    );
    // console.log(res.rows, 'ini res model')
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

// export const loginUser = async (email, password) => {
//     try {
//         const res = await pool.query(
//             `
//             `
//         )
//     } catch (error) {

//     }
// }

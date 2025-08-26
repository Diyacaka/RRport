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

export const getUserId = async (id) => {
  try {
    const res = await pool.query(`select id, role_id, is_profile_complete from users where id = $1`,[id]
    )
    return res.rows[0]
  } catch (error) {
    throw error
  }
}

///// - TOKEN SECTION - /////

export const saveRefreshToken = async (user_id, token, expires_at) => {
  try {
    await pool.query(`
      insert into refresh_tokens (user_id, token, revoked_at)
      values ($1,$2,$3)
      `,[user_id, token, expires_at])
  } catch (error) {
    throw error
  }
}


export const getRefreshToken = async (token) => {
  try {
    const res = await pool.query(`
      select user_id, token, revoked_at from refresh_tokens where token = $1 and revoked = false
      `,[token])
      return res.rows[0]
  } catch (error) {
    throw error
  }
}

export const revokeRefreshToken = async (token) => {
  try {
    await pool.query(`
      update refresh_tokens set revoked = true, revoked_at = now() where token = $1
      `,[token])
  } catch (error) {
    throw error
  }
}

///// - USER SECTION - /////

export const newUSer = async (email, password, role_id) => {
  try {
    // if (role_id === undefined || role_id === null) {
    //   role_id = 3
    // }

    // if (email.toLowerCase().includes("guru")) {
    //   role_id = 2
    // }
    // // else if (role_id = 2) {
    // //   return {error:`Forbidden register format`}
    // // }

    // // if (role_id === 1) {
    // //   return { messages: `you cannot pick this role` };
    // // }

    const res = await pool.query(
      `insert into users (email, password, role_id, is_profile_complete)
            values ($1,$2,$3,false) returning id
            `,
      [email, password, role_id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

export const markProfileCompleted = async (id) => {
  try {
    const res = await pool.query(
      `update users set is_profile_complete = true where id=$1 returning id`,
      [id]
    );
    return res.rows[0];
  } catch (error) {
    throw error;
  }
};

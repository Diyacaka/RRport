// import { pool } from "../config/config.js";

// export async function getStudentId(id) {
//   try {
//     const res = await pool.query(
//       `select full_name, gender, address, birth_date, nisn, class where id = $1`,
//       [id]
//     );
//     return res.rows[0];
//   } catch (error) {
//     throw error;
//   }
// }

// export async function getStudentName (name) {
//   try {
//     const res = await pool.query(`select full_name, gender, address, birth_date, nisn, class where name = $1`, [name])
//     return res.rows[0]
//   } catch (error) {
//     throw error
//   }
// }


// export async function newStudent(
//   user_id,
//   full_name,
//   role_id,
//   gender,
//   address,
//   birth_date,
//   nisn,
//   classes
// ) {
//   try {
//     const res = await pool.query(
//       `insert into students (user_id, full_name, role, gender, address, birth_date, nisn, class)
//             values ($1,$2,$3,$4,$5,$6,$7,$8)
//             `,
//       [user_id, full_name, role_id, gender, address, birth_date, nisn, classes]
//     );
//     return res;
//   } catch (error) {
//     throw error;
//   }
// }


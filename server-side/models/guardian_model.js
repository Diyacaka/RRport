import { pool } from "../config/config.js";

export async function getGuardian (full_name) {
    try {
        const res = await pool.query(`select full_name,relations,job,address,phone_number from guardian where full_name ILIKE $1`,
            [`%${full_name}%`]
        )
        

        return res.rows[0]
    } catch (error) {
        throw error
    }
}

export async function newGuardian (user_id, full_name,role_id , relations, job, address, phone_number, emergency_number) {
    try {
        // const {id, role} = req.user
        const res = await pool.query(`insert into guardian (user_id, full_name, role, relations, job, address, phone_number, emergency_number)
            values ($1,$2,$3,$4,$5,$6,$7,$8) returning id`, [user_id, full_name,role_id, relations, job, address, phone_number, emergency_number])

            return res
    } catch (error) {
        throw error
    }
}
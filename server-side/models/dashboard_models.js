import { pool } from "../config/config";

export async function getGuardianId (id) {
    try {
        const res = await pool.query(`
            select full_name, photo_profile, relations, job, address, phone_number from guardian where id = $1
            `,[id])
        return res.rows[0]
    } catch (error) {
        throw error
    }
}

export async function getStudentId (id) {
    try {
        const res = pool.query(`
            select 
            `)
    } catch (error) {
        
    }
}
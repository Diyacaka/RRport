import { newAdminSchema } from "../../helpers/zod.js"
import { getGuardianId, getStudentId, getTeacherId, newAdmins } from "../../models/admin_techerSide_model/admin_model.js"

///// - ADMIN CRUD ZONE - /////
export async function getTeacherIdHandler (req, res, next) {
    try {
        const {id} = req.params
        const result = await getTeacherId(id)
        if (!result) {
            return res.status(404).json({messages:`no teacher with id ${id}`})
        }
        return res.status(200).json({data:result})
    } catch (error) {
        throw error
    }
}

export async function getGuardianIdHandler (req, res, next) {
    try {
        const {id} = req.params
        const result = await getGuardianId(id)
        if (!result) {
            return res.status(404).json({messages:`no guardian with id ${id}`})
        }
        return res.status(200).json({data:result})
    } catch (error) {
        throw error
    }
}

export async function getStudentIdHandler (req, res, next) {
    try {
        const {id} = req.params
        const result = await getStudentId(id)
        if (!result) {
            return res.status(404).json({messages:`no student with id ${id}`})
        }
        return res.status(200).json({data:result})
    } catch (error) {
        throw error
    }
}

export async function newAdminsHandler (req, res, next) {
    try {
        const {id: user_id, role: role_id} = req.user
        const {full_name, phone_numebr, emergency_number, address, photo_profile} = newAdminSchema(req.body)
        const result = await newAdmins(user_id, full_name, role_id, phone_numebr, emergency_number, address, photo_profile)
        return res.status(201).json({messages:`profile for admin completed, proceed`, data: result})
    } catch (error) {
        throw error
    }
}

export async function updateAdminsHandler (req, res, next) {
    try {
        const admin = await getadmin
    } catch (error) {
        
    }
}
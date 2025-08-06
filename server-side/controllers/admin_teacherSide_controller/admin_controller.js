import { getTeacherId } from "../../models/admin_techerSide_model/admin_model.js"

export async function getTeacherIdHandler (req, res, next) {
    try {
        const result = await getTeacherId()
    } catch (error) {
        throw error
    }
}
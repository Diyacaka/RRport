import { guardianRegisterSchema } from "../helpers/zod.js";
import { getGuardian, newGuardian } from "../models/guardian_model.js";

export async function findGuardian(req, res, next) {
    try {
        const {full_name} = req.body
        const result = await getGuardian(full_name)        

        if (!result) {
            res.status(404).json({messages:`Cannot find Guardian`})
        }

        return res.status(201).json({data:result})
    } catch (error) {
        throw error
    }
}

export async function registerGuardian (req, res, next) {
    try {
        const {id: user_id, role: role_id} = req.user
        const {full_name, relations, job, address, phone_number, emergency_number} = guardianRegisterSchema.parse(req.body)
        const result = await newGuardian(user_id, full_name,role_id, relations, job, address, phone_number, emergency_number)

        return res.status(200).json({messages:'regiter succes', data: result})
    } catch (error) {
        throw (error)
    }
}
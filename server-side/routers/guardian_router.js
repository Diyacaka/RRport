import express from "express"
import { getGuardianHandler, getGuardianIDHandler, newGuardianHandler, softDeleteGuardianHandler, updateGuardianHandler } from "../controllers/guardian_controller.js"
import { authentication } from "../middlewares/authentication.js"

const guardianRouter = express.Router()

guardianRouter.get('/getGuardian/:id', getGuardianIDHandler)
guardianRouter.get('/getGuardian', getGuardianHandler)

guardianRouter.post('/newGuardian', authentication ,newGuardianHandler)

guardianRouter.patch('/updateGuardian/:id', authentication, updateGuardianHandler)

guardianRouter.patch('/deleteGuardian/:id', softDeleteGuardianHandler)

export default guardianRouter
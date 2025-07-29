import express from "express"
import { findGuardian, registerGuardian } from "../controllers/guardian_controller.js"
import { authentication } from "../middlewares/authentication.js"

const guardianRouter = express.Router()

guardianRouter.get('/getGuardian', findGuardian)

guardianRouter.post('/newGuardian', authentication ,registerGuardian)

export default guardianRouter
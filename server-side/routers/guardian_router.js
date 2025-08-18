import express from "express"
import { getGuardianNameHandler, getGuardianIDHandler, newGuardianHandler, updateGuardianHandler, newStudentHandler, updateStudentHandler, getStudentIDHandler, getStudentNameHandler, getStudentGuardianHandler } from "../controllers/guardian_controller.js"
import { authentication, profileCheck } from "../middlewares/authentication.js"
import { studentUpdateAuth } from "../middlewares/authorization.js"

const guardianRouter = express.Router()


//GUARDIAN SECTION//

guardianRouter.get('/guardian/:id', getGuardianIDHandler)
guardianRouter.get('/guardian', getGuardianNameHandler)
guardianRouter.get('/guardian', authentication, getStudentGuardianHandler)

guardianRouter.post('/guardian', authentication ,newGuardianHandler)

guardianRouter.patch('/guardian/:id', authentication, updateGuardianHandler)


//STUDENT SECTION//

guardianRouter.get('/student/:id', getStudentIDHandler)
guardianRouter.get('/student', getStudentNameHandler)

guardianRouter.post('/student/:id', authentication, profileCheck, newStudentHandler)

guardianRouter.patch('/student/:id',authentication,studentUpdateAuth, updateStudentHandler)

export default guardianRouter
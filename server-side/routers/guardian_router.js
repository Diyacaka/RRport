import express from "express"
import { getGuardianNameHandler, getGuardianIDHandler, newGuardianHandler, updateGuardianHandler, newStudentHandler, updateStudentHandler, getStudentIDHandler, getStudentNameHandler } from "../controllers/guardian_controller.js"
import { authentication, profileCheck } from "../middlewares/authentication.js"

const guardianRouter = express.Router()


//GUARDIAN SECTION//

guardianRouter.get('/getGuardian/:id', getGuardianIDHandler)
guardianRouter.get('/getGuardian', getGuardianNameHandler)

guardianRouter.post('/newGuardian', authentication ,newGuardianHandler)

guardianRouter.patch('/updateGuardian/:id', authentication, updateGuardianHandler)


//STUDENT SECTION//

guardianRouter.get('/getStudentId/:id', getStudentIDHandler)
guardianRouter.get('/getStudentName', getStudentNameHandler)

guardianRouter.post('/newStudent/:id', authentication, profileCheck, newStudentHandler)

guardianRouter.patch('/updateStudent', updateStudentHandler)

export default guardianRouter
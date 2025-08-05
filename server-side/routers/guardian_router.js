import express from "express"
import { getGuardianHandler, getGuardianIDHandler, newGuardianHandler, softDeleteGuardianHandler, updateGuardianHandler, newStudentHandler, updateStudentHandler, getStudentIDHandler, getStudentNameHandler } from "../controllers/guardian_controller.js"
import { authentication } from "../middlewares/authentication.js"
// import { getStudentID, getStudentName } from "../models/guardian_model.js"

const guardianRouter = express.Router()


//GUARDIAN SECTION//
guardianRouter.get('/getGuardian/:id', getGuardianIDHandler)
guardianRouter.get('/getGuardian', getGuardianHandler)

guardianRouter.post('/newGuardian', authentication ,newGuardianHandler)

guardianRouter.patch('/updateGuardian/:id', authentication, updateGuardianHandler)

guardianRouter.patch('/deleteGuardian/:id', softDeleteGuardianHandler)


//STUDENT SECTION//

guardianRouter.get('/getStudentId/:id', getStudentIDHandler)
guardianRouter.get('/getStudentName', getStudentNameHandler)

guardianRouter.post('/newStudent/:id', authentication, newStudentHandler)

guardianRouter.patch('/updateStudent', updateStudentHandler)

export default guardianRouter
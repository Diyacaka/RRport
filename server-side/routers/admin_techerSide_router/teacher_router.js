import express from "express"
import { newTeacherHandler } from "../../controllers/admin_teacherSide_controller/teacher_controller.js"
import { authentication } from "../../middlewares/authentication.js"
// getGuardianWardsByNameHandler
const teacherRouter = express.Router()

// teacherRouter.get('/getGuardianWardsByName',authentication, getGuardianWardsByNameHandler)

teacherRouter.post('/newTeacher',authentication, newTeacherHandler)


export default teacherRouter
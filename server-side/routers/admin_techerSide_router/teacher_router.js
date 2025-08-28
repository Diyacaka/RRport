import express from "express"
import { getGuardianWardsByNameHandler, newTeacherHandler } from "../../controllers/admin_teacherSide_controller/teacher_controller.js"
import { authentication } from "../../middlewares/authentication.js"

const teacherRouter = express.Router()

teacherRouter.get('/getGuardianWardsByName',authentication, getGuardianWardsByNameHandler)

teacherRouter.post('/newTeacher',authentication, newTeacherHandler)


export default teacherRouter
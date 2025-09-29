import express from "express"
import { addScoreBulkHandler, getAllReportsHandler, getAllTeacherHandler, getStudentReportHandler, getTeacherByid, getTeacherByNameHandler, getTeacherSubjectByNameHandler, newReportHandler, newTeacherHandler, updateTeacherHandler } from "../../controllers/admin_teacherSide_controller/teacher_controller.js"
import { authentication } from "../../middlewares/authentication.js"
// getGuardianWardsByNameHandler
const teacherRouter = express.Router()

teacherRouter.get('/teacher_subject/search', getTeacherSubjectByNameHandler)
teacherRouter.get('/teacher_name', authentication, getTeacherByNameHandler)

teacherRouter.post('/newTeacher',authentication, newTeacherHandler)

teacherRouter.patch(`/update_teacher`, authentication, updateTeacherHandler)


teacherRouter.get('/', authentication, getTeacherByid)
teacherRouter.get('/all_teacher', getAllTeacherHandler)

///// - REPORT- /////
teacherRouter.get('/reports', getAllReportsHandler)

teacherRouter.post('/report/newReport', authentication, newReportHandler)
teacherRouter.post('/report/addSCore/:report_id', authentication, addScoreBulkHandler)

teacherRouter.get('/reports/student', getStudentReportHandler)
export default teacherRouter
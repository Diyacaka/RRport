import express from 'express'
import { getStudentIdHandler, newStudentHandler } from '../student_controller.js'
import { authentication } from '../server-side/middlewares/authentication.js'

const studentRouter = express.Router()

studentRouter.get('/getStudent/:id', getStudentIdHandler)

studentRouter.post('/registerStudent', authentication, newStudentHandler)

export default studentRouter
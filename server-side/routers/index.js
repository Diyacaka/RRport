import express from "express";
import auth_router from "../modules/universal/auth_router.js";
import guardianRouter from "../modules/guardian/guardian_router.js";
import studentRouter from "../modules/student/student_router.js";
import teacherRouter from "../modules/teacher/teacher_router.js";
const router = express.Router();

router.use("/auth", auth_router);
router.use("/guardian", guardianRouter);
router.use("/student", studentRouter);


router.use("/teacher", teacherRouter);

// router.use("/student", studentRouter)

export default router;

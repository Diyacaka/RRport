import express from "express";
import auth_router from "./auth_router.js";
import guardianRouter from "./guardian_router.js";
// import studentRouter from "./student_router.js";
const router = express.Router();

router.use("/auth", auth_router);
router.use("/guardian", guardianRouter)
// router.use("/student", studentRouter)

export default router;

import express from "express";
import auth_router from "./auth_router.js";
import guardianRouter from "./guardian_router.js";
const router = express.Router();

router.use("/auth", auth_router);
router.use("/guardian", guardianRouter)

export default router;

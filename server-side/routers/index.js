import express from "express";
import auth_router from "./auth_router.js";
const router = express.Router();

router.use("/gi", auth_router);

export default router;

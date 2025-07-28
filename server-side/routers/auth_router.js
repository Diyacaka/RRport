import express from "express";
import { login, register, userByEmail } from "../controllers/auth_controller.js";

const auth_router = express.Router();

auth_router.get('/email', userByEmail);

auth_router.post('/registration', register)
auth_router.post('/login', login)

export default auth_router;
